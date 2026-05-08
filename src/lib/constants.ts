// ============================================================
// Global constants and configuration
// ============================================================

// --- Election dates ---
export const ELECCIONES_CONGRESO_2026 = "2026-03-08";
export const ELECCIONES_PRESIDENCIA_2026 = "2026-05-31";

// --- SECOP API endpoints ---
export const SECOP_BASE_URL = "https://www.datos.gov.co/resource";
export const SECOP_ENDPOINTS = {
  secop1: `${SECOP_BASE_URL}/f789-7hwg.json`,
  secop2_procesos: `${SECOP_BASE_URL}/p6dx-8zbt.json`,
  secop2_contratos: `${SECOP_BASE_URL}/jbjy-vk9h.json`,
  secop_integrado: `${SECOP_BASE_URL}/rpmr-utcd.json`,
};

// --- Senado API ---
export const SENADO_API_URL = "https://app.senado.gov.co/backend/api/public/v1/senators?format=json";
export const SENADO_ASISTENCIAS_URL = "https://app.senado.gov.co/backend/api/public/v1/assistances";
export const SENADO_COMISIONES_URL = "https://app.senado.gov.co/backend/api/public/v1/commissions?format=json";

// --- Other data source URLs ---
export const DATA_SOURCES = {
  api_electoral: "https://apielectoral.co",
  registraduria_2026: "https://wapp.registraduria.gov.co/electoral/2026/",
  sigep: "https://www.funcionpublica.gov.co/dafpIndexerBHV/",
  ley_2013: "https://www.funcionpublica.gov.co/fdci/",
  procuraduria_siri: "https://apps.procuraduria.gov.co/webcert/",
  contraloria: "https://www.contraloria.gov.co/responsabilidad-fiscal",
  cuentas_claras: "https://cnecuentasclaras.gov.co",
  cedae: "https://cedae.datasketch.co",
};

// --- Geography ---
export const GEOJSON_COLOMBIA_URL =
  "https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/be6a1a5e1e2d9e6bdb16e0e645292c0e3e0299e0/co-small.json";
export const DIVIPOLA_URL = `${SECOP_BASE_URL}/gdxc-w37w.json`;

// --- App configuration ---
export const APP_NAME = "Eoro";
export const APP_DESCRIPTION =
  "Plataforma de fiscalización ciudadana. Datos abiertos de candidatos y funcionarios públicos de Colombia.";
export const APP_URL = "https://eoro.co";

// --- Pagination defaults ---
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// --- Score de Transparencia weights (legacy) ---
/** @deprecated Use EORO_SCORE_TIERS instead */
export const SCORE_WEIGHTS = {
  financiacion_reportada: 20,
  sin_antecedentes_disciplinarios: 15,
  sin_responsabilidad_fiscal: 15,
  declaro_bienes: 15,
  crecimiento_patrimonial_razonable: 10,
  sin_familiares_vinculados: 10,
  sin_cambios_partido: 10,
  reporto_conflictos: 5,
} as const;

// --- Eoro Score tiers (5 niveles) ---
export const EORO_SCORE_TIERS = [
  { min: 90, max: 100, label: "Intacto", slug: "intacto" as const, color: "#27ae60", bg: "#e8f5e9", description: "Sin hallazgos verificados o mínimos" },
  { min: 70, max: 89, label: "Leve", slug: "leve" as const, color: "#8bc34a", bg: "#f1f8e9", description: "Hallazgos menores documentados" },
  { min: 45, max: 69, label: "Dañado", slug: "danado" as const, color: "#d35400", bg: "#fef3e2", description: "Hallazgos significativos" },
  { min: 20, max: 44, label: "Roto", slug: "roto" as const, color: "#c0392b", bg: "#fce4e4", description: "Múltiples hallazgos graves" },
  { min: 0, max: 19, label: "Destruido", slug: "destruido" as const, color: "#7b1fa2", bg: "#f3e5f5", description: "Riesgo extremo de corrupción" },
] as const;

// --- Eoro restoration rules ---
export const EORO_RESTORATION_RULES: Record<string, number> = {
  absuelto: 0.80,
  prescrito: 0.50,
  archivado: 0.60,
  anulado: 1.00,
};

// --- Navigation items ---
export const NAV_ITEMS = [
  { label: "Inicio", href: "/", icon: "home" },
  { label: "Senado", href: "/senado", icon: "users" },
  { label: "Presidenciales 2026", href: "/presidenciales", icon: "users" },
  { label: "Gobierno", href: "/gobierno", icon: "landmark" },
  { label: "Mapa", href: "/mapa", icon: "map" },
  { label: "Conexiones", href: "/conexiones", icon: "network" },
  { label: "Historial", href: "/historial", icon: "clock" },
  { label: "Contribuye", href: "/contribuye", icon: "heart" },
  { label: "Datos", href: "/datos", icon: "database" },
] as const;

// --- Legal disclaimer ---
export const DISCLAIMER =
  "La información publicada proviene exclusivamente de fuentes públicas oficiales amparadas por la Ley 1712 de 2014 (Transparencia) y la Ley 2013 de 2019. Esta plataforma no realiza afirmaciones sobre culpabilidad. Presenta datos verificables para el ejercicio del control social ciudadano consagrado en el Artículo 270 de la Constitución Política de Colombia.";

// --- Colombian departments (DANE codes) ---
export const DEPARTAMENTOS = [
  { codigo: "05", nombre: "Antioquia", capital: "Medellin" },
  { codigo: "08", nombre: "Atlantico", capital: "Barranquilla" },
  { codigo: "11", nombre: "Bogota D.C.", capital: "Bogota" },
  { codigo: "13", nombre: "Bolivar", capital: "Cartagena" },
  { codigo: "15", nombre: "Boyaca", capital: "Tunja" },
  { codigo: "17", nombre: "Caldas", capital: "Manizales" },
  { codigo: "18", nombre: "Caqueta", capital: "Florencia" },
  { codigo: "19", nombre: "Cauca", capital: "Popayan" },
  { codigo: "20", nombre: "Cesar", capital: "Valledupar" },
  { codigo: "23", nombre: "Cordoba", capital: "Monteria" },
  { codigo: "25", nombre: "Cundinamarca", capital: "Bogota" },
  { codigo: "27", nombre: "Choco", capital: "Quibdo" },
  { codigo: "41", nombre: "Huila", capital: "Neiva" },
  { codigo: "44", nombre: "La Guajira", capital: "Riohacha" },
  { codigo: "47", nombre: "Magdalena", capital: "Santa Marta" },
  { codigo: "50", nombre: "Meta", capital: "Villavicencio" },
  { codigo: "52", nombre: "Narino", capital: "Pasto" },
  { codigo: "54", nombre: "Norte de Santander", capital: "Cucuta" },
  { codigo: "63", nombre: "Quindio", capital: "Armenia" },
  { codigo: "66", nombre: "Risaralda", capital: "Pereira" },
  { codigo: "68", nombre: "Santander", capital: "Bucaramanga" },
  { codigo: "70", nombre: "Sucre", capital: "Sincelejo" },
  { codigo: "73", nombre: "Tolima", capital: "Ibague" },
  { codigo: "76", nombre: "Valle del Cauca", capital: "Cali" },
  { codigo: "81", nombre: "Arauca", capital: "Arauca" },
  { codigo: "85", nombre: "Casanare", capital: "Yopal" },
  { codigo: "86", nombre: "Putumayo", capital: "Mocoa" },
  { codigo: "88", nombre: "San Andres", capital: "San Andres" },
  { codigo: "91", nombre: "Amazonas", capital: "Leticia" },
  { codigo: "94", nombre: "Guainia", capital: "Inirida" },
  { codigo: "95", nombre: "Guaviare", capital: "San Jose del Guaviare" },
  { codigo: "97", nombre: "Vaupes", capital: "Mitu" },
  { codigo: "99", nombre: "Vichada", capital: "Puerto Carreno" },
] as const;
