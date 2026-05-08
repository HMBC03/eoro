import { Senador, AsistenciaAPI, ComisionAPI } from "@/lib/types";
import { SENADO_API_URL, SENADO_ASISTENCIAS_URL, SENADO_COMISIONES_URL } from "@/lib/constants";

export async function fetchSenadores(): Promise<Senador[]> {
  const res = await fetch(SENADO_API_URL, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching Senado API: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchAsistencias(
  startAt: string,
  endAt: string
): Promise<AsistenciaAPI[]> {
  const url = `${SENADO_ASISTENCIAS_URL}?format=json&start_at=${startAt}&end_at=${endAt}`;
  
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching Asistencias API: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

export function unificarSenadoresConAsistencias(
  Senado: Senador[],
  asimtas: AsistenciaAPI[]
): Senador[] {
  const sesionesUnicas = new Set(
    asimtas.filter((a) => a.attended?.toLowerCase() === "si").map((a) => `${a.plenary_id}-${a.plenary_created_at}`)
  );
  const totalSesiones = sesionesUnicas.size;

  const conteoPorSenador: Record<number, number> = {};
  
  for (const a of asimtas) {
    if (a.attended?.toLowerCase() === "si") {
      const senatorIdNum = parseInt(a.senator_id, 10);
      conteoPorSenador[senatorIdNum] = (conteoPorSenador[senatorIdNum] || 0) + 1;
    }
  }

  return Senado.map((s) => {
    const asists = conteoPorSenador[s.id] || 0;
    const pct = totalSesiones > 0 ? Math.round((asists / totalSesiones) * 100) : 0;
    
    return {
      ...s,
      totalAsistencias: asists,
      totalSesiones,
      porcentajeAsistencia: pct,
    };
});
}

export function getPartidosUnicos(senadores: Senador[]): string[] {
  return [...new Set(senadores.map((s) => s.party_name))].sort();
}

export function filterSenadores(
  Senado: Senador[],
  filters: {
    partido?: string;
    busqueda?: string;
  }
): Senador[] {
  let result = Senado;

  if (filters.partido) {
    result = result.filter((s) => s.party_name === filters.partido);
  }

  if (filters.busqueda) {
    const q = filters.busqueda.toLowerCase();
    result = result.filter((s) => s.name.toLowerCase().includes(q));
  }

  return result;
}

export function getDefaultDateRange(): { startAt: string; endAt: string } {
  const endAt = new Date("2026-07-19");
  const startAt = new Date("2022-07-20");
  
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  
  return {
    startAt: formatDate(startAt),
    endAt: formatDate(endAt),
  };
}

export async function fetchComisiones(): Promise<ComisionAPI[]> {
  const res = await fetch(SENADO_COMISIONES_URL, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching Comisiones API: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

export function relacionarSenadoresConComisiones(
  Senado: Senador[],
  comisiones: ComisionAPI[]
): Senador[] {
  const comisionMap = new Map(comisiones.map((c) => [c.id.toString(), c.name]));

  return Senado.map((s) => ({
    ...s,
    comisionNombre: s.commission_id ? comisionMap.get(s.commission_id) || `Comisión ${s.commission_id}` : "Sin comisión",
  }));
}