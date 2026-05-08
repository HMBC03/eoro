// ============================================================
// Presidential candidates 2026 — real names, realistic mock data
// ============================================================

import type {
  Persona,
  Candidatura,
  CargoPublico,
  DeclaracionPatrimonio,
  Antecedente,
  VinculoFamiliar,
  FinanciacionCampana,
  Alerta,
  CandidatoCompleto,
} from "@/lib/types";
import { getPartidoById, mockPartidos } from "./partidos";
import { calculateScore } from "@/lib/utils";

// --- Dynasty types ---
export interface DynastyNode {
  id: string;
  label: string;
  role: string;
  generation: number; // 0=abuelo, 1=padre, 2=candidato
  isMainCandidate: boolean;
  color: string;
}

export interface DynastyEdge {
  source: string;
  target: string;
  relation: string;
}

// ============================================================
// Personas
// ============================================================

const personas: Persona[] = [
  {
    id: "pres01",
    cedula: "7900001001",
    nombre_completo: "Ivan Cepeda Castro",
    fecha_nacimiento: "1962-04-07",
    departamento_origen: "Bogota D.C.",
    foto_url: null,

    biografia:
      "Senador desde 2014, activista de derechos humanos. Hijo de Manuel Cepeda Vargas, senador de la Union Patriotica asesinado en 1994. Lider del Pacto Historico y principal figura de la izquierda colombiana.",
    redes_sociales: { twitter: "@IvanCepedaCast" },
    created_at: "2025-06-01",
    updated_at: "2026-02-20",
  },
  {
    id: "pres02",
    cedula: "7900002002",
    nombre_completo: "Abelardo de la Espriella Vives",
    fecha_nacimiento: "1975-09-15",
    departamento_origen: "Bolivar",
    foto_url: null,

    biografia:
      "Abogado penalista, conocido por casos mediaticos. Independiente de derecha, ha defendido figuras controversiales. Primera candidatura presidencial.",
    redes_sociales: { twitter: "@ABOREPODERPOPUL" },
    created_at: "2025-06-01",
    updated_at: "2026-02-20",
  },
  {
    id: "pres03",
    cedula: "7900003003",
    nombre_completo: "Sergio Fajardo Valderrama",
    fecha_nacimiento: "1956-06-19",
    departamento_origen: "Antioquia",
    foto_url: null,

    biografia:
      "Matematico y politico. Exalcalde de Medellin (2004-2007), exgobernador de Antioquia (2012-2015). Tercer intento presidencial. Lider de centro independiente.",
    redes_sociales: { twitter: "@sergio_fajardo" },
    created_at: "2025-06-01",
    updated_at: "2026-02-20",
  },
  {
    id: "pres04",
    cedula: "7900004004",
    nombre_completo: "Paloma Valencia Laserna",
    fecha_nacimiento: "1977-10-01",
    departamento_origen: "Cauca",
    foto_url: null,

    biografia:
      "Senadora por Centro Democratico desde 2014. Nieta del presidente Guillermo Leon Valencia (1962-1966) e hija del senador Guillermo Leon Valencia Munoz. Representante de la derecha uribista.",
    redes_sociales: { twitter: "@PalomaValworker" },
    created_at: "2025-06-01",
    updated_at: "2026-02-20",
  },

];

// --- Familiares politicos (para dinastias) ---
const familiaresPres: Persona[] = [
  {
    id: "fam-pres01",
    cedula: "0000000001",
    nombre_completo: "Manuel Cepeda Vargas",
    fecha_nacimiento: "1930-01-01",
    departamento_origen: "Bogota D.C.",
    foto_url: null,

    biografia:
      "Senador por la Union Patriotica. Asesinado en 1994 por paramilitares. Su muerte fue reconocida como crimen de Estado por la Corte Interamericana de DDHH.",
    redes_sociales: {},
    created_at: "2025-06-01",
    updated_at: "2025-06-01",
  },
  {
    id: "fam-pres04a",
    cedula: "0000000002",
    nombre_completo: "Guillermo Leon Valencia",
    fecha_nacimiento: "1909-04-27",
    departamento_origen: "Cauca",
    foto_url: null,

    biografia:
      "Presidente de Colombia (1962-1966). Segundo presidente del Frente Nacional. Abuelo de Paloma Valencia.",
    redes_sociales: {},
    created_at: "2025-06-01",
    updated_at: "2025-06-01",
  },
  {
    id: "fam-pres04b",
    cedula: "0000000003",
    nombre_completo: "Guillermo Leon Valencia Munoz",
    fecha_nacimiento: "1945-03-15",
    departamento_origen: "Cauca",
    foto_url: null,

    biografia:
      "Senador de la Republica. Hijo del presidente Valencia. Padre de Paloma Valencia. Politico conservador del Cauca.",
    redes_sociales: {},
    created_at: "2025-06-01",
    updated_at: "2025-06-01",
  },
];

// ============================================================
// Candidaturas
// ============================================================

const candidaturas: Candidatura[] = [
  { id: "pcand01", persona_id: "pres01", eleccion_year: 2026, tipo: "presidencia", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "pcand02", persona_id: "pres02", eleccion_year: 2026, tipo: "presidencia", partido_id: "ind_der", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "pcand03", persona_id: "pres03", eleccion_year: 2026, tipo: "presidencia", partido_id: "dyc", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "pcand04", persona_id: "pres04", eleccion_year: 2026, tipo: "presidencia", partido_id: "cd", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  // Historical
  { id: "phist01", persona_id: "pres01", eleccion_year: 2014, tipo: "senado", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: 98_432, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "phist02", persona_id: "pres01", eleccion_year: 2018, tipo: "senado", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: 125_876, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "phist03", persona_id: "pres01", eleccion_year: 2022, tipo: "senado", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: 156_200, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "phist04", persona_id: "pres03", eleccion_year: 2018, tipo: "presidencia", partido_id: "dyc", circunscripcion: "Nacional", votos_obtenidos: 4_589_696, elegido: false, estado: "inscrito", fuente: "CEDAE" },
  { id: "phist05", persona_id: "pres03", eleccion_year: 2022, tipo: "presidencia", partido_id: "dyc", circunscripcion: "Nacional", votos_obtenidos: 888_585, elegido: false, estado: "inscrito", fuente: "CEDAE" },
  { id: "phist06", persona_id: "pres04", eleccion_year: 2014, tipo: "senado", partido_id: "cd", circunscripcion: "Nacional", votos_obtenidos: 67_890, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "phist07", persona_id: "pres04", eleccion_year: 2018, tipo: "senado", partido_id: "cd", circunscripcion: "Nacional", votos_obtenidos: 89_120, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "phist08", persona_id: "pres04", eleccion_year: 2022, tipo: "senado", partido_id: "cd", circunscripcion: "Nacional", votos_obtenidos: 102_345, elegido: true, estado: "electo", fuente: "CEDAE" },
];

// ============================================================
// Cargos publicos
// ============================================================

const cargos: CargoPublico[] = [
  { id: "pcar01", persona_id: "pres01", cargo: "Senador de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2014-07-20", fecha_fin: null, partido_id: "ph", nivel: "nacional", fuente: "SIGEP" },
  { id: "pcar02", persona_id: "pres03", cargo: "Alcalde de Medellin", entidad: "Alcaldia de Medellin", departamento: "Antioquia", municipio: "Medellin", fecha_inicio: "2004-01-01", fecha_fin: "2007-12-31", partido_id: "av", nivel: "municipal", fuente: "SIGEP" },
  { id: "pcar03", persona_id: "pres03", cargo: "Gobernador de Antioquia", entidad: "Gobernacion de Antioquia", departamento: "Antioquia", municipio: "Medellin", fecha_inicio: "2012-01-01", fecha_fin: "2015-12-31", partido_id: "av", nivel: "departamental", fuente: "SIGEP" },
  { id: "pcar04", persona_id: "pres04", cargo: "Senadora de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2014-07-20", fecha_fin: null, partido_id: "cd", nivel: "nacional", fuente: "SIGEP" },
];

// ============================================================
// Declaraciones patrimonio
// ============================================================

const declaraciones: DeclaracionPatrimonio[] = [
  { id: "pd01", persona_id: "pres01", anio: 2020, patrimonio_total: 620_000_000, ingresos_total: 210_000_000, bienes_inmuebles_valor: 380_000_000, vehiculos_valor: 60_000_000, cuentas_bancarias_saldo: 180_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "pd02", persona_id: "pres01", anio: 2025, patrimonio_total: 780_000_000, ingresos_total: 240_000_000, bienes_inmuebles_valor: 450_000_000, vehiculos_valor: 80_000_000, cuentas_bancarias_saldo: 250_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "pd03", persona_id: "pres03", anio: 2015, patrimonio_total: 1_200_000_000, ingresos_total: 350_000_000, bienes_inmuebles_valor: 780_000_000, vehiculos_valor: 120_000_000, cuentas_bancarias_saldo: 300_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "pd04", persona_id: "pres03", anio: 2025, patrimonio_total: 1_600_000_000, ingresos_total: 420_000_000, bienes_inmuebles_valor: 950_000_000, vehiculos_valor: 150_000_000, cuentas_bancarias_saldo: 500_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "pd05", persona_id: "pres04", anio: 2020, patrimonio_total: 2_800_000_000, ingresos_total: 380_000_000, bienes_inmuebles_valor: 1_900_000_000, vehiculos_valor: 250_000_000, cuentas_bancarias_saldo: 650_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "pd06", persona_id: "pres04", anio: 2025, patrimonio_total: 3_400_000_000, ingresos_total: 450_000_000, bienes_inmuebles_valor: 2_200_000_000, vehiculos_valor: 300_000_000, cuentas_bancarias_saldo: 900_000_000, conflictos_interes: [], fuente: "Ley 2013" },
];

// ============================================================
// Antecedentes
// ============================================================

const antecedentes: Antecedente[] = [];

// ============================================================
// Vinculos familiares
// ============================================================

const vinculos: VinculoFamiliar[] = [
  { id: "pv01", persona_a_id: "pres01", persona_b_id: "fam-pres01", parentesco: "Hijo", verificado: true, fuente: "Registro publico / CIDH", fecha_deteccion: "2025-01-01" },
  { id: "pv02", persona_a_id: "pres04", persona_b_id: "fam-pres04a", parentesco: "Nieta", verificado: true, fuente: "Registro publico", fecha_deteccion: "2025-01-01" },
  { id: "pv03", persona_a_id: "pres04", persona_b_id: "fam-pres04b", parentesco: "Hija", verificado: true, fuente: "Registro publico", fecha_deteccion: "2025-01-01" },
];

// ============================================================
// Financiacion campana
// ============================================================

const financiacion: FinanciacionCampana[] = [
  { id: "pf01", candidatura_id: "pcand01", tipo: "ingreso", concepto: "Aporte del partido Pacto Historico", valor: 2_500_000_000, aportante_nombre: "Pacto Historico", aportante_tipo: "estatal", fuente: "Cuentas Claras" },
  { id: "pf02", candidatura_id: "pcand01", tipo: "ingreso", concepto: "Donaciones individuales", valor: 800_000_000, aportante_nombre: "Donaciones ciudadanas (<1M c/u)", aportante_tipo: "particular", fuente: "Cuentas Claras" },
  { id: "pf03", candidatura_id: "pcand01", tipo: "gasto", concepto: "Publicidad en medios digitales", valor: 1_200_000_000, aportante_nombre: "", aportante_tipo: "propio", fuente: "Cuentas Claras" },
  { id: "pf04", candidatura_id: "pcand03", tipo: "ingreso", concepto: "Recursos propios", valor: 600_000_000, aportante_nombre: "Sergio Fajardo Valderrama", aportante_tipo: "propio", fuente: "Cuentas Claras" },
  { id: "pf05", candidatura_id: "pcand03", tipo: "ingreso", concepto: "Aporte del partido", valor: 400_000_000, aportante_nombre: "Dignidad y Compromiso", aportante_tipo: "estatal", fuente: "Cuentas Claras" },
  { id: "pf06", candidatura_id: "pcand04", tipo: "ingreso", concepto: "Aporte Centro Democratico", valor: 1_800_000_000, aportante_nombre: "Centro Democratico", aportante_tipo: "estatal", fuente: "Cuentas Claras" },
  { id: "pf07", candidatura_id: "pcand04", tipo: "ingreso", concepto: "Recursos propios", valor: 500_000_000, aportante_nombre: "Paloma Valencia Laserna", aportante_tipo: "propio", fuente: "Cuentas Claras" },
];

// ============================================================
// Alertas
// ============================================================

const alertas: Alerta[] = [
  {
    id: "pal01",
    persona_id: "pres04",
    contrato_id: null,
    tipo: "nepotismo",
    severidad: "baja",
    titulo: "Dinastia politica familiar de tres generaciones",
    descripcion: "Paloma Valencia es nieta del presidente Guillermo Leon Valencia (1962-1966) e hija del senador Guillermo Leon Valencia Munoz. Tres generaciones en la politica colombiana.",
    datos_soporte: { generaciones: 3, cargos_familiares: ["Presidente", "Senador", "Senadora"] },
    detectada_at: "2025-06-01",
    verificada: true,
  },
  {
    id: "pal05",
    persona_id: "pres02",
    contrato_id: null,
    tipo: "no_reporte",
    severidad: "alta",
    titulo: "No ha reportado financiacion de campana 2026",
    descripcion: "Abelardo de la Espriella no ha presentado reporte de ingresos ni gastos en Cuentas Claras (CNE).",
    datos_soporte: { fecha_corte: "2026-03-03" },
    detectada_at: "2026-03-03",
    verificada: true,
  },
];

// ============================================================
// Build complete profiles
// ============================================================

function buildPresidencial(personaId: string): CandidatoCompleto | null {
  const persona = [...personas, ...familiaresPres].find((p) => p.id === personaId);
  if (!persona) return null;

  const candidaturasPersona = candidaturas.filter((c) => c.persona_id === personaId);
  const candidaturaActual = candidaturasPersona.find((c) => c.eleccion_year === 2026);
  if (!candidaturaActual) return null;

  const partido = getPartidoById(candidaturaActual.partido_id) ?? mockPartidos[0];

  const base: CandidatoCompleto = {
    persona,
    candidatura_actual: candidaturaActual,
    partido,
    historial_cargos: cargos.filter((c) => c.persona_id === personaId),
    historial_candidaturas: candidaturasPersona,
    declaraciones: declaraciones.filter((d) => d.persona_id === personaId),
    antecedentes: antecedentes.filter((a) => a.persona_id === personaId),
    vinculos: vinculos.filter((v) => v.persona_a_id === personaId || v.persona_b_id === personaId),
    financiacion: financiacion.filter((f) => f.candidatura_id === candidaturaActual.id),
    alertas: alertas.filter((a) => a.persona_id === personaId),
    score: { persona_id: personaId, total: 0, desglose: { financiacion_reportada: 0, sin_antecedentes_disciplinarios: 0, sin_responsabilidad_fiscal: 0, declaro_bienes: 0, crecimiento_patrimonial_razonable: 0, sin_familiares_vinculados: 0, sin_cambios_partido: 0, reporto_conflictos: 0 } },
    eoro_score: null,
  };

  base.score = calculateScore(base);
  return base;
}

export function getPresidenciales2026(): CandidatoCompleto[] {
  return personas
    .map((p) => buildPresidencial(p.id))
    .filter((c): c is CandidatoCompleto => c !== null);
}

export function getPresidencialById(id: string): CandidatoCompleto | null {
  return buildPresidencial(id);
}

export function getFamiliarPres(familiarId: string): Persona | undefined {
  return familiaresPres.find((f) => f.id === familiarId);
}

// ============================================================
// Dynasty data for graph card
// ============================================================

export function getDynastyData(candidateId: string): { nodes: DynastyNode[]; edges: DynastyEdge[] } | null {
  if (candidateId === "pres01") {
    return {
      nodes: [
        { id: "fam-pres01", label: "Manuel Cepeda Vargas", role: "Senador UP (asesinado 1994)", generation: 1, isMainCandidate: false, color: "#E76F51" },
        { id: "pres01", label: "Ivan Cepeda Castro", role: "Senador / Candidato presidencial", generation: 2, isMainCandidate: true, color: "#FFD700" },
      ],
      edges: [
        { source: "fam-pres01", target: "pres01", relation: "Padre → Hijo" },
      ],
    };
  }

  if (candidateId === "pres04") {
    return {
      nodes: [
        { id: "fam-pres04a", label: "Guillermo Leon Valencia", role: "Presidente 1962-1966", generation: 0, isMainCandidate: false, color: "#89B0D0" },
        { id: "fam-pres04b", label: "G. L. Valencia Munoz", role: "Senador de la Republica", generation: 1, isMainCandidate: false, color: "#E76F51" },
        { id: "pres04", label: "Paloma Valencia Laserna", role: "Senadora / Candidata presidencial", generation: 2, isMainCandidate: true, color: "#003DA5" },
      ],
      edges: [
        { source: "fam-pres04a", target: "fam-pres04b", relation: "Padre → Hijo" },
        { source: "fam-pres04b", target: "pres04", relation: "Padre → Hija" },
      ],
    };
  }

  return null;
}

export { familiaresPres };
