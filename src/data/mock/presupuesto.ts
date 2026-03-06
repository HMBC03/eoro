// ============================================================
// Mock PGN 2025 — Presupuesto General de la Nacion
// 3 ramas, ~25 entidades, cross-referenced with mockContratos
// ============================================================

import type { RamaGobierno, EntidadPresupuestal } from "@/lib/types";
import { mockContratos } from "./contratos";

// --- Entidades: Rama Ejecutiva ---

const entidadesEjecutiva: EntidadPresupuestal[] = [
  {
    id: "ent01",
    nombre: "Ministerio de Educacion",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 55_000_000_000_000,
    ejecutado: 46_750_000_000_000,
    porcentaje_ejecucion: 85,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent02",
    nombre: "Ministerio de Defensa",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 42_000_000_000_000,
    ejecutado: 38_640_000_000_000,
    porcentaje_ejecucion: 92,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent03",
    nombre: "Ministerio de Hacienda",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 45_000_000_000_000,
    ejecutado: 39_600_000_000_000,
    porcentaje_ejecucion: 88,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent04",
    nombre: "Ministerio de Salud",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 38_000_000_000_000,
    ejecutado: 29_640_000_000_000,
    porcentaje_ejecucion: 78,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent05",
    nombre: "Ministerio de Transporte",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 18_000_000_000_000,
    ejecutado: 12_960_000_000_000,
    porcentaje_ejecucion: 72,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent06",
    nombre: "Ministerio de Trabajo",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 12_500_000_000_000,
    ejecutado: 10_375_000_000_000,
    porcentaje_ejecucion: 83,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent07",
    nombre: "Ministerio de Agricultura",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 8_200_000_000_000,
    ejecutado: 6_396_000_000_000,
    porcentaje_ejecucion: 78,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent08",
    nombre: "Ministerio de Minas y Energia",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 7_800_000_000_000,
    ejecutado: 6_708_000_000_000,
    porcentaje_ejecucion: 86,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent09",
    nombre: "Ministerio de Vivienda",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 9_500_000_000_000,
    ejecutado: 7_030_000_000_000,
    porcentaje_ejecucion: 74,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent10",
    nombre: "Ministerio de Ambiente",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 3_200_000_000_000,
    ejecutado: 2_560_000_000_000,
    porcentaje_ejecucion: 80,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent11",
    nombre: "Ministerio de Comercio",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 4_600_000_000_000,
    ejecutado: 3_910_000_000_000,
    porcentaje_ejecucion: 85,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent12",
    nombre: "Ministerio de Cultura",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 1_800_000_000_000,
    ejecutado: 1_350_000_000_000,
    porcentaje_ejecucion: 75,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent13",
    nombre: "Ministerio de TIC",
    tipo: "ministerio",
    rama_id: "rama01",
    presupuesto_asignado: 5_400_000_000_000,
    ejecutado: 4_752_000_000_000,
    porcentaje_ejecucion: 88,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent14",
    nombre: "DIAN",
    tipo: "departamento_admin",
    rama_id: "rama01",
    presupuesto_asignado: 8_500_000_000_000,
    ejecutado: 8_075_000_000_000,
    porcentaje_ejecucion: 95,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent15",
    nombre: "DNP",
    tipo: "departamento_admin",
    rama_id: "rama01",
    presupuesto_asignado: 2_800_000_000_000,
    ejecutado: 2_492_000_000_000,
    porcentaje_ejecucion: 89,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent16",
    nombre: "Policia Nacional",
    tipo: "departamento_admin",
    rama_id: "rama01",
    presupuesto_asignado: 15_000_000_000_000,
    ejecutado: 13_500_000_000_000,
    porcentaje_ejecucion: 90,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent17",
    nombre: "INVIAS",
    tipo: "departamento_admin",
    rama_id: "rama01",
    presupuesto_asignado: 10_200_000_000_000,
    ejecutado: 7_956_000_000_000,
    porcentaje_ejecucion: 78,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent18",
    nombre: "ICBF",
    tipo: "departamento_admin",
    rama_id: "rama01",
    presupuesto_asignado: 7_500_000_000_000,
    ejecutado: 6_600_000_000_000,
    porcentaje_ejecucion: 88,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent19",
    nombre: "SENA",
    tipo: "departamento_admin",
    rama_id: "rama01",
    presupuesto_asignado: 6_800_000_000_000,
    ejecutado: 5_712_000_000_000,
    porcentaje_ejecucion: 84,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent20",
    nombre: "Contraloria General",
    tipo: "organo_control",
    rama_id: "rama01",
    presupuesto_asignado: 1_200_000_000_000,
    ejecutado: 1_080_000_000_000,
    porcentaje_ejecucion: 90,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent21",
    nombre: "Procuraduria General",
    tipo: "organo_control",
    rama_id: "rama01",
    presupuesto_asignado: 980_000_000_000,
    ejecutado: 862_400_000_000,
    porcentaje_ejecucion: 88,
    num_contratos: 0,
    valor_contratos: 0,
  },
];

// --- Entidades: Rama Legislativa ---

const entidadesLegislativa: EntidadPresupuestal[] = [
  {
    id: "ent30",
    nombre: "Senado de la Republica",
    tipo: "corporacion",
    rama_id: "rama02",
    presupuesto_asignado: 380_000_000_000,
    ejecutado: 342_000_000_000,
    porcentaje_ejecucion: 90,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent31",
    nombre: "Camara de Representantes",
    tipo: "corporacion",
    rama_id: "rama02",
    presupuesto_asignado: 820_000_000_000,
    ejecutado: 713_400_000_000,
    porcentaje_ejecucion: 87,
    num_contratos: 0,
    valor_contratos: 0,
  },
];

// --- Entidades: Rama Judicial ---

const entidadesJudicial: EntidadPresupuestal[] = [
  {
    id: "ent40",
    nombre: "Corte Suprema de Justicia",
    tipo: "corte",
    rama_id: "rama03",
    presupuesto_asignado: 350_000_000_000,
    ejecutado: 318_500_000_000,
    porcentaje_ejecucion: 91,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent41",
    nombre: "Consejo de Estado",
    tipo: "corte",
    rama_id: "rama03",
    presupuesto_asignado: 280_000_000_000,
    ejecutado: 243_600_000_000,
    porcentaje_ejecucion: 87,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent42",
    nombre: "Corte Constitucional",
    tipo: "corte",
    rama_id: "rama03",
    presupuesto_asignado: 120_000_000_000,
    ejecutado: 111_600_000_000,
    porcentaje_ejecucion: 93,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent43",
    nombre: "Consejo Superior de la Judicatura",
    tipo: "corte",
    rama_id: "rama03",
    presupuesto_asignado: 4_200_000_000_000,
    ejecutado: 3_570_000_000_000,
    porcentaje_ejecucion: 85,
    num_contratos: 0,
    valor_contratos: 0,
  },
  {
    id: "ent44",
    nombre: "Fiscalia General de la Nacion",
    tipo: "corte",
    rama_id: "rama03",
    presupuesto_asignado: 1_550_000_000_000,
    ejecutado: 1_364_000_000_000,
    porcentaje_ejecucion: 88,
    num_contratos: 0,
    valor_contratos: 0,
  },
];

// --- Cross-reference contratos → entidades ---

function enrichEntidadesConContratos(entidades: EntidadPresupuestal[]): EntidadPresupuestal[] {
  return entidades.map((ent) => {
    const matchingContratos = mockContratos.filter(
      (c) => c.entidad_nombre === ent.nombre
    );
    return {
      ...ent,
      num_contratos: matchingContratos.length,
      valor_contratos: matchingContratos.reduce((s, c) => s + c.valor_contrato, 0),
    };
  });
}

// --- Build Ramas ---

const PGN_TOTAL = 523_000_000_000_000; // ~$523 billones COP

const ramas: RamaGobierno[] = [
  {
    id: "rama01",
    nombre: "Rama Ejecutiva",
    presupuesto_total: 323_480_000_000_000,
    porcentaje_pgn: 61.9,
    entidades: enrichEntidadesConContratos(entidadesEjecutiva),
  },
  {
    id: "rama02",
    nombre: "Rama Legislativa",
    presupuesto_total: 1_200_000_000_000,
    porcentaje_pgn: 0.23,
    entidades: enrichEntidadesConContratos(entidadesLegislativa),
  },
  {
    id: "rama03",
    nombre: "Rama Judicial",
    presupuesto_total: 6_500_000_000_000,
    porcentaje_pgn: 1.24,
    entidades: enrichEntidadesConContratos(entidadesJudicial),
  },
];

// --- Public API ---

export function getPresupuestoData() {
  return {
    pgn_total: PGN_TOTAL,
    ramas,
    stats: getPresupuestoStats(),
  };
}

export function getPresupuestoStats() {
  const allEntidades = ramas.flatMap((r) => r.entidades);
  const ejecucionPromedio = Math.round(
    allEntidades.reduce((s, e) => s + e.porcentaje_ejecucion, 0) / allEntidades.length
  );
  const totalContratos = allEntidades.reduce((s, e) => s + e.num_contratos, 0);
  const valorContratosTotal = allEntidades.reduce((s, e) => s + e.valor_contratos, 0);

  const topEntidades = [...allEntidades]
    .sort((a, b) => b.presupuesto_asignado - a.presupuesto_asignado)
    .slice(0, 10);

  return {
    pgn_total: PGN_TOTAL,
    ejecucion_promedio: ejecucionPromedio,
    entidades_total: allEntidades.length,
    total_contratos: totalContratos,
    valor_contratos_total: valorContratosTotal,
    top_entidades: topEntidades,
  };
}

export function getEntidadById(id: string): EntidadPresupuestal | null {
  for (const rama of ramas) {
    const found = rama.entidades.find((e) => e.id === id);
    if (found) return found;
  }
  return null;
}

export function getContratosByEntidad(entidadNombre: string) {
  return mockContratos.filter((c) => c.entidad_nombre === entidadNombre);
}

export { ramas, PGN_TOTAL };
