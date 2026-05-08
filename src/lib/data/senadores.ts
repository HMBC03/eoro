import { Senador, AsistenciaAPI, ComisionAPI, VotacionAPI, SesionDetalle } from "@/lib/types";
import { SENADO_API_URL, SENADO_ASISTENCIAS_URL, SENADO_COMISIONES_URL, SENADO_VOTACIONES_URL } from "@/lib/constants";

export async function fetchSenadores(): Promise<Senador[]> {
  const res = await fetch(SENADO_API_URL, {
    next: { revalidate: 1200 },
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
    next: { revalidate: 1200 },
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

  return Senado.map((s) => {
    const fechaIngreso = primerasFechas[s.id] || null;
    const sesionesAsistidas = sesionesActivasPorSenador[s.id]?.size || 0;
    const pct = sesionesTotalesPeriodo > 0 ? Math.round((sesionesAsistidas / sesionesTotalesPeriodo) * 100) : 0;
    
    return {
      ...s,
      totalAsistencias: sesionesAsistidas,
      totalSesiones: sesionesTotalesPeriodo,
      porcentajeAsistencia: pct,
      fechaInicio: fechaIngreso,
      sesionesTotalesPeriodo: sesionesTotalesPeriodo,
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
    next: { revalidate: 1200 },
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

export async function fetchVotaciones(
  startAt: string,
  endAt: string
): Promise<VotacionAPI[]> {
  const url = `${SENADO_VOTACIONES_URL}?format=json&start_at=${startAt}&end_at=${endAt}`;
  
  const res = await fetch(url, {
    next: { revalidate: 1200 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching Votaciones API: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

export function unificarSenadoresConVotaciones(
  Senado: Senador[],
  votaciones: VotacionAPI[],
  asistencias: AsistenciaAPI[]
): Senador[] {
  const FECHA_INICIO_PERIODO = "2022-07-20";
  const FECHA_FIN_PERIODO = "2026-07-19";

  const votacionesPorSenador: Record<number, { si: number; no: number; abst: number; total: number }> = {};
  const plenariasConVotacion = new Set<string>();
  
  for (const v of votaciones) {
    if (v.created_at >= FECHA_INICIO_PERIODO && v.created_at <= FECHA_FIN_PERIODO) {
      plenariasConVotacion.add(v.plenary_id);
      const senatorIdNum = parseInt(v.senator_id, 10);
      
      if (!votacionesPorSenador[senatorIdNum]) {
        votacionesPorSenador[senatorIdNum] = { si: 0, no: 0, abst: 0, total: 0 };
      }
      
      const vote = v.vote?.toLowerCase() || "";
      if (vote === "si") votacionesPorSenador[senatorIdNum].si++;
      else if (vote === "no") votacionesPorSenador[senatorIdNum].no++;
      else if (vote === "abstención" || vote === "abst") votacionesPorSenador[senatorIdNum].abst++;
      
      votacionesPorSenador[senatorIdNum].total++;
    }
  }

  const retirosDetectados: Record<number, boolean> = {};
  
  const plenariasAsistidas: Record<number, Set<string>> = {};
  for (const a of asistencias) {
    if (a.attended?.toLowerCase() === "si" && a.plenary_created_at >= FECHA_INICIO_PERIODO && a.plenary_created_at <= FECHA_FIN_PERIODO) {
      const senatorIdNum = parseInt(a.senator_id, 10);
      if (!plenariasAsistidas[senatorIdNum]) {
        plenariasAsistidas[senatorIdNum] = new Set();
      }
      plenariasAsistidas[senatorIdNum].add(a.plenary_id);
    }
  }
  
  for (const [senatorId, plenarias] of Object.entries(plenariasAsistidas)) {
    const numId = parseInt(senatorId, 10);
    for (const plenaryId of plenarias) {
      if (plenariasConVotacion.has(plenaryId) && !votaciones.find(v => v.plenary_id === plenaryId && parseInt(v.senator_id, 10) === numId)) {
        retirosDetectados[numId] = true;
        break;
      }
    }
  }

  return Senado.map((s) => {
    const stats = votacionesPorSenador[s.id] || { si: 0, no: 0, abst: 0, total: 0 };
    const sesionesDondeVoto = new Set(
      votaciones.filter(v => parseInt(v.senator_id, 10) === s.id && v.created_at >= FECHA_INICIO_PERIODO && v.created_at <= FECHA_FIN_PERIODO).map(v => v.plenary_id)
    ).size;
    const participacion = plenariasConVotacion.size > 0 
      ? Math.round((sesionesDondeVoto / Math.max(sesionesDondeVoto, plenariasConVotacion.size)) * 100) 
      : 0;
    
    return {
      ...s,
      totalVotaciones: stats.total,
      totalSesionesDondeVoto: sesionesDondeVoto,
      votosSi: stats.si,
      votosNo: stats.no,
      abstenciones: stats.abst,
      participacionVotaciones: Math.min(participacion, 100),
      seRetiro: retirosDetectados[s.id] || false,
    };
  });
}

export function analizarSesionesDetalle(
  Senado: Senador[],
  votaciones: VotacionAPI[],
  asistencias: AsistenciaAPI[]
): Senador[] {
  const FECHA_INICIO_PERIODO = "2022-07-20";
  const FECHA_FIN_PERIODO = "2026-07-19";

  const todasFechasSesiones = new Set<string>();
  for (const a of asistencias) {
    const fecha = a.plenary_created_at;
    if (fecha >= FECHA_INICIO_PERIODO && fecha <= FECHA_FIN_PERIODO) {
      todasFechasSesiones.add(fecha);
    }
  }
  const sesionesTotalesPeriodo = Array.from(todasFechasSesiones).sort();

  const primerasFechas: Record<number, string> = {};
  for (const a of asistencias) {
    const senatorIdNum = parseInt(a.senator_id, 10);
    if (a.plenary_created_at && (!primerasFechas[senatorIdNum] || a.plenary_created_at < primerasFechas[senatorIdNum])) {
      primerasFechas[senatorIdNum] = a.plenary_created_at;
    }
  }

  const votacionesPorSenadorPlenary: Record<string, Set<string>> = {};
  for (const v of votaciones) {
    if (v.created_at >= FECHA_INICIO_PERIODO && v.created_at <= FECHA_FIN_PERIODO) {
      const key = `${v.senator_id}_${v.plenary_id}`;
      if (!votacionesPorSenadorPlenary[key]) {
        votacionesPorSenadorPlenary[key] = new Set();
      }
      votacionesPorSenadorPlenary[key].add(v.vote?.toLowerCase() || "");
    }
  }

  const sesionesAsistidasPorSenador: Record<number, Set<string>> = {};
  for (const a of asistencias) {
    if (a.attended?.toLowerCase() === "si") {
      const senatorIdNum = parseInt(a.senator_id, 10);
      if (!sesionesAsistidasPorSenador[senatorIdNum]) {
        sesionesAsistidasPorSenador[senatorIdNum] = new Set();
      }
      sesionesAsistidasPorSenador[senatorIdNum].add(a.plenary_created_at);
    }
  }

  return Senado.map((s) => {
    const fechaInicioSenador = primerasFechas[s.id] || FECHA_INICIO_PERIODO;
    const sesionesAsistidas = sesionesAsistidasPorSenador[s.id] || new Set();
    const sesionesDetalle: SesionDetalle[] = [];
    const alertas: string[] = [];

    for (const fecha of sesionesTotalesPeriodo) {
      const asistio = sesionesAsistidas.has(fecha);
      const plenaryIdOriginal = Array.from(
        asistencias.filter(a => a.plenary_created_at === fecha && parseInt(a.senator_id, 10) === s.id)
      )[0]?.plenary_id;

      let estado: "asistio_voto" | "asistio_sin_voto" | "no_asistio" = "no_asistio";
      let voto: "si" | "no" | "abst" | null = null;

      if (asistio) {
        const key = `${s.id}_${plenaryIdOriginal || fecha}`;
        const votosSet = votacionesPorSenadorPlenary[key];
        if (votosSet && votosSet.size > 0) {
          estado = "asistio_voto";
          if (votosSet.has("si")) voto = "si";
          else if (votosSet.has("no")) voto = "no";
          else if (votosSet.has("abstención") || votosSet.has("abst")) voto = "abst";
        } else {
          estado = "asistio_sin_voto";
        }
      }

      sesionesDetalle.push({
        fecha,
        plenary_id: plenaryIdOriginal || fecha,
        estado,
        voto,
      });
    }

    let secuenciaSinAsistir = 0;
    let maxSecuenciaSinAsistir = 0;
    for (const sesion of sesionesDetalle) {
      if (sesion.estado === "no_asistio") {
        secuenciaSinAsistir++;
        if (secuenciaSinAsistir > maxSecuenciaSinAsistir) {
          maxSecuenciaSinAsistir = secuenciaSinAsistir;
        }
      } else {
        secuenciaSinAsistir = 0;
      }
    }
    if (maxSecuenciaSinAsistir >= 5) {
      alertas.push("brecha_5_sesiones");
    }

    const sesionesDesdeIngreso = sesionesTotalesPeriodo.filter(f => f >= fechaInicioSenador).length;
    const sesionesAsistidasDesdeIngreso = Array.from(sesionesAsistidas).filter(f => f >= fechaInicioSenador).length;
    const porcentajeDesdeIngreso = sesionesDesdeIngreso > 0 
      ? Math.round((sesionesAsistidasDesdeIngreso / sesionesDesdeIngreso) * 100) 
      : 0;

    const fechaInicioDate = new Date(fechaInicioSenador);
    const limiteLlegadaTardia = new Date("2023-12-31");
    let inicioTardio = false;
    let mensajeInicioTardio = "";

    if (fechaInicioDate > limiteLlegadaTardia) {
      const mesesDiff = Math.floor((fechaInicioDate.getTime() - new Date("2022-07-20").getTime()) / (30 * 24 * 60 * 60 * 1000));
      inicioTardio = true;
      mensajeInicioTardio = `Inicia asistencia: ${new Date(fechaInicioSenador).toLocaleDateString("es-CO")} (${mesesDiff} meses después del inicio del período legislativo)`;
    }

    return {
      ...s,
      sesionesDetalle: sesionesDetalle.sort((a, b) => b.fecha.localeCompare(a.fecha)),
      alertas,
      sesionesTotalesPeriodo: sesionesTotalesPeriodo.length,
      sesionesDesdeIngreso,
      porcentajeDesdeIngreso,
      inicioTardio,
      mensajeInicioTardio,
    };
  });
}