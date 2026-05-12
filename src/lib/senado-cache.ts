import { Senador, ComisionAPI } from "@/lib/types";
import { SENADO_API_URL, SENADO_ASISTENCIAS_URL, SENADO_COMISIONES_URL, SENADO_VOTACIONES_URL } from "@/lib/constants";

const CACHE_PREFIX = "senado_";
const DEFAULT_TTL = 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface SenadoresCache {
  Senador: Senador[];
  partidos: string[];
  comisiones: ComisionAPI[];
  totalSesiones: number;
}

function getCacheKey(startAt: string, endAt: string): string {
  return `${CACHE_PREFIX}${startAt}_${endAt}`;
}

function getCacheTimestamp(key: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<unknown> = JSON.parse(raw);
    return entry.timestamp;
  } catch {
    return null;
  }
}

export function getCacheAge(startAt: string, endAt: string): string | null {
  const ts = getCacheTimestamp(getCacheKey(startAt, endAt));
  if (!ts) return null;
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `hace ${hours}h`;
  if (minutes > 0) return `hace ${minutes}min`;
  return "justo ahora";
}

export function getCachedSenadores(startAt: string, endAt: string): SenadoresCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getCacheKey(startAt, endAt));
    if (!raw) return null;
    const entry: CacheEntry<SenadoresCache> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > DEFAULT_TTL) {
      localStorage.removeItem(getCacheKey(startAt, endAt));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedSenadores(startAt: string, endAt: string, data: SenadoresCache): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<SenadoresCache> = { data, timestamp: Date.now() };
    localStorage.setItem(getCacheKey(startAt, endAt), JSON.stringify(entry));
  } catch {
    clearSenadoresCache();
  }
}

export function clearSenadoresCache(): void {
  if (typeof window === "undefined") return;
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function getPartidosUnicos(Senado: Senador[]): string[] {
  return [...new Set<string>(Senado.map((s) => s.party_name))].sort();
}

function processSenadores(
  SenadoRaw: import("@/lib/types").Senador[],
  asimtas: import("@/lib/types").AsistenciaAPI[],
  votaciones: import("@/lib/types").VotacionAPI[],
  comisiones: ComisionAPI[]
): { Senador: Senador[]; partidos: string[]; totalSesiones: number } {
  const FECHA_INICIO_PERIODO = "2022-07-20";
  const FECHA_FIN_PERIODO = "2026-07-19";

  const primerasFechas: Record<number, string> = {};
  for (const a of asimtas) {
    const senatorIdNum = parseInt(a.senator_id, 10);
    if (a.plenary_created_at && (!primerasFechas[senatorIdNum] || a.plenary_created_at < primerasFechas[senatorIdNum])) {
      primerasFechas[senatorIdNum] = a.plenary_created_at;
    }
  }

  const todasFechasSesiones = new Set<string>();
  for (const a of asimtas) {
    const fecha = a.plenary_created_at;
    if (fecha >= FECHA_INICIO_PERIODO && fecha <= FECHA_FIN_PERIODO) {
      todasFechasSesiones.add(fecha);
    }
  }
  const sesionesTotalesPeriodo = todasFechasSesiones.size;

  const sesionesActivasPorSenador: Record<number, Set<string>> = {};
  for (const a of asimtas) {
    if (a.attended?.toLowerCase() === "si") {
      const senatorIdNum = parseInt(a.senator_id, 10);
      const fecha = a.plenary_created_at;
      const fechaInicioSenador = primerasFechas[senatorIdNum] || FECHA_INICIO_PERIODO;
      if (fecha >= fechaInicioSenador && fecha >= FECHA_INICIO_PERIODO && fecha <= FECHA_FIN_PERIODO) {
        if (!sesionesActivasPorSenador[senatorIdNum]) {
          sesionesActivasPorSenador[senatorIdNum] = new Set();
        }
        sesionesActivasPorSenador[senatorIdNum].add(fecha);
      }
    }
  }

  const comisionMap = new Map(comisiones.map((c) => [c.id.toString(), c.name]));

  const Senador = SenadoRaw.map((s) => {
    const fechaIngreso = primerasFechas[s.id] || null;
    const sesionesAsistidas = sesionesActivasPorSenador[s.id]?.size || 0;
    const pct = sesionesTotalesPeriodo > 0 ? Math.round((sesionesAsistidas / sesionesTotalesPeriodo) * 100) : 0;
    const sesionesDesdeIngreso = sesionesActivasPorSenador[s.id]?.size || 0;
    const pctDesdeIngreso = sesionesTotalesPeriodo > 0 ? Math.round((sesionesAsistidas / sesionesTotalesPeriodo) * 100) : 0;
    const alertas: string[] = [];

    const alertasSesiones: string[] = [];
    const sesionesOrdenadas = [...todasFechasSesiones].sort();
    let consecutivos = 0;
    for (const fecha of sesionesOrdenadas) {
      const senatorIdNum = s.id;
      const asistio = asimtas.some(
        (a) =>
          parseInt(a.senator_id, 10) === senatorIdNum &&
          a.plenary_created_at === fecha &&
          a.attended?.toLowerCase() === "si"
      );
      if (!asistio) {
        consecutivos++;
        if (consecutivos >= 5) {
          alertasSesiones.push(`brecha_5_sesiones`);
        }
      } else {
        consecutivos = 0;
      }
    }
    if (alertasSesiones.length > 0) alertas.push(...alertasSesiones);

    const fechaInicioDate = fechaIngreso ? new Date(fechaIngreso) : null;
    const limiteTardio = new Date("2023-12-31");
    const inicioTardio = fechaInicioDate ? fechaInicioDate > limiteTardio : false;

    return {
      ...s,
      totalAsistencias: sesionesAsistidas,
      totalSesiones: sesionesTotalesPeriodo,
      porcentajeAsistencia: pct,
      comisionNombre: s.commission_id ? comisionMap.get(s.commission_id) || `Comisión ${s.commission_id}` : "Sin comisión",
      fechaInicio: fechaIngreso,
      sesionesTotalesPeriodo: sesionesTotalesPeriodo,
      sesionesDesdeIngreso,
      porcentajeDesdeIngreso: pctDesdeIngreso,
      alertas,
      inicioTardio,
    } as Senador;
  });

  const partidos = getPartidosUnicos(Senador);

  return { Senador, partidos, totalSesiones: sesionesTotalesPeriodo };
}

export async function loadSenadoresData(
  startAt: string,
  endAt: string,
  onProgress?: (step: string, progress: number) => void
): Promise<SenadoresCache> {
  onProgress?.("Descargando lista de senadores...", 10);
  const [senadoresRaw, comisiones] = await Promise.all([
    fetchJSON<import("@/lib/types").Senador[]>(SENADO_API_URL),
    fetchJSON<ComisionAPI[]>(SENADO_COMISIONES_URL),
  ]);

  onProgress?.("Descargando asistencias...", 30);
  const asimtas = await fetchJSON<import("@/lib/types").AsistenciaAPI[]>(
    `${SENADO_ASISTENCIAS_URL}?format=json&start_at=${startAt}&end_at=${endAt}`
  );

  onProgress?.("Descargando votaciones...", 60);
  const votaciones = await fetchJSON<import("@/lib/types").VotacionAPI[]>(
    `${SENADO_VOTACIONES_URL}?format=json&start_at=${startAt}&end_at=${endAt}`
  );

  onProgress?.("Procesando datos...", 85);
  const result = processSenadores(senadoresRaw, asimtas, votaciones, comisiones);

  const cache: SenadoresCache = {
    Senador: result.Senador,
    partidos: result.partidos,
    comisiones,
    totalSesiones: result.totalSesiones,
  };

  onProgress?.("Guardando en cache...", 95);
  setCachedSenadores(startAt, endAt, cache);

  return cache;
}
