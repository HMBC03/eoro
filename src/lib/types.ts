// ============================================================
// Transparencia Colombia — Type Definitions
// Single source of truth for all data structures
// ============================================================

// --- Core Entities ---

export interface Persona {
  id: string;
  cedula: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  departamento_origen: string;
  foto_url: string | null;
  biografia: string;
  redes_sociales: RedesSociales;
  created_at: string;
  updated_at: string;
}

export interface RedesSociales {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface Partido {
  id: string;
  nombre: string;
  sigla: string;
  color_hex: string;
  logo_url: string | null;
  personeria_juridica: boolean;
  activo: boolean;
  ideologia: string;
}

// --- Political Career ---

export interface Candidatura {
  id: string;
  persona_id: string;
  eleccion_year: number;
  tipo:
    | "presidencia"
    | "senado"
    | "camara"
    | "gobernacion"
    | "alcaldia"
    | "concejo"
    | "asamblea";
  partido_id: string;
  circunscripcion: string;
  votos_obtenidos: number | null;
  elegido: boolean;
  estado: "inscrito" | "retirado" | "inhabilitado" | "electo";
  fuente: string;
}

export interface CargoPublico {
  id: string;
  persona_id: string;
  cargo: string;
  entidad: string;
  departamento: string;
  municipio: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  partido_id: string | null;
  nivel: "nacional" | "departamental" | "municipal";
  fuente: string;
}

// --- Patrimony & Declarations ---

export interface DeclaracionPatrimonio {
  id: string;
  persona_id: string;
  anio: number;
  patrimonio_total: number;
  ingresos_total: number;
  bienes_inmuebles_valor: number;
  vehiculos_valor: number;
  cuentas_bancarias_saldo: number;
  conflictos_interes: string[];
  fuente: string;
}

// --- Legal Records ---

export interface Antecedente {
  id: string;
  persona_id: string;
  tipo: "disciplinario" | "fiscal" | "penal" | "perdida_investidura";
  estado: "vigente" | "archivado" | "sancionado" | "absuelto";
  descripcion: string;
  entidad_reporta: string;
  fecha_sancion: string;
  fecha_vencimiento: string | null;
  fuente: string;
}

// --- Family & Connections ---

export interface VinculoFamiliar {
  id: string;
  persona_a_id: string;
  persona_b_id: string;
  parentesco: string;
  verificado: boolean;
  fuente: string;
  fecha_deteccion: string;
}

// --- Campaign Finance ---

export interface FinanciacionCampana {
  id: string;
  candidatura_id: string;
  tipo: "ingreso" | "gasto";
  concepto: string;
  valor: number;
  aportante_nombre: string;
  aportante_tipo:
    | "propio"
    | "familiar"
    | "particular"
    | "empresa"
    | "estatal"
    | "credito";
  fuente: string;
}

// --- Contracts ---

export interface Contrato {
  id: string;
  secop_id: string;
  entidad_nombre: string;
  entidad_nit: string;
  contratista_nombre: string;
  contratista_nit: string;
  objeto: string;
  valor_contrato: number;
  valor_adiciones: number;
  modalidad: string;
  estado: "activo" | "finalizado" | "liquidado" | "terminado_anticipadamente";
  fecha_firma: string;
  fecha_inicio: string;
  fecha_fin: string;
  departamento: string;
  municipio: string;
}

export interface ContratoConVotos extends Contrato {
  votos_valida: number;
  votos_cuestiona: number;
}

// --- Alerts ---

export interface Alerta {
  id: string;
  persona_id: string | null;
  contrato_id: string | null;
  tipo:
    | "nepotismo"
    | "enriquecimiento"
    | "concentracion_contratos"
    | "cambio_partido"
    | "no_reporte";
  severidad: "alta" | "media" | "baja";
  titulo: string;
  descripcion: string;
  datos_soporte: Record<string, unknown>;
  detectada_at: string;
  verificada: boolean;
}

// --- Geography ---

export interface Departamento {
  codigo_dane: string;
  nombre: string;
  capital: string;
  num_candidatos: number;
  num_contratos: number;
  valor_contratos: number;
  num_alertas: number;
}

// --- Graph Structures ---

export interface GrafoNodo {
  id: string;
  label: string;
  tipo: "candidato" | "familiar" | "cargo" | "contratista" | "partido";
  color: string;
  foto_url?: string;
  metadata: Record<string, unknown>;
}

export interface GrafoEdge {
  source: string;
  target: string;
  tipo: "familiar" | "cargo" | "contrato" | "partido" | "financiador";
  label: string;
  peso: number;
}

export interface GrafoData {
  nodos: GrafoNodo[];
  edges: GrafoEdge[];
}

// --- Transparency Score (legacy — usar EoroScoreCache) ---

/** @deprecated Use EoroScoreCache instead */
export interface ScoreTransparencia {
  persona_id: string;
  total: number; // 0-100
  desglose: {
    financiacion_reportada: number; // 0-20
    sin_antecedentes_disciplinarios: number; // 0-15
    sin_responsabilidad_fiscal: number; // 0-15
    declaro_bienes: number; // 0-15
    crecimiento_patrimonial_razonable: number; // 0-10
    sin_familiares_vinculados: number; // 0-10
    sin_cambios_partido: number; // 0-10
    reporto_conflictos: number; // 0-5
  };
}

// --- Eoro Score System ---

export interface EoroCategoria {
  id: string;
  nombre: string;
  slug: string;
  peso_max: number;
  descripcion: string;
  orden: number;
}

export interface EoroVariable {
  id: string;
  categoria_id: string;
  nombre: string;
  slug: string;
  penalizacion: number;
  condicion: string;
  fuente_tipo: "oficial" | "judicial" | "periodistica" | "ciudadana" | "electoral";
  activa: boolean;
  orden: number;
}

export interface EoroEvaluacion {
  id: string;
  persona_id: string;
  variable_id: string;
  puntos_restados: number;
  evidencia_url: string;
  fuente_descripcion: string;
  fuente_verificada: boolean;
  fecha_deteccion: string;
  fecha_resolucion: string | null;
  resolucion_tipo:
    | "absuelto"
    | "prescrito"
    | "archivado"
    | "anulado"
    | "vigente"
    | null;
  notas: string;
  created_at: string;
  updated_at: string;
}

export interface EoroReporteCiudadano {
  id: string;
  persona_id: string;
  reportante_hash: string;
  descripcion: string;
  evidencia_urls: string[];
  estado:
    | "pendiente"
    | "en_revision"
    | "verificado"
    | "rechazado"
    | "duplicado";
  verificado_por: string | null;
  verificado_at: string | null;
  fuentes_verificacion: string[];
  impacto_score: number;
  notas_internas: string;
  created_at: string;
  updated_at: string;
}

export interface EoroHistorial {
  id: string;
  persona_id: string;
  score_anterior: number;
  score_nuevo: number;
  variable_id: string | null;
  evento:
    | "evaluacion_creada"
    | "evaluacion_resuelta"
    | "reporte_verificado"
    | "reporte_rechazado"
    | "restauracion"
    | "recalculo";
  detalle: string;
  created_at: string;
}

export interface EoroScoreCache {
  persona_id: string;
  score_total: number;
  desglose_categorias: Record<string, { max: number; restado: number }>;
  num_evaluaciones: number;
  num_reportes_verificados: number;
  calculated_at: string;
}

export type EoroScoreTier =
  | "intacto"
  | "leve"
  | "danado"
  | "roto"
  | "destruido";

// --- Candidate Profile (aggregated view) ---

export interface CandidatoCompleto {
  persona: Persona;
  candidatura_actual: Candidatura;
  partido: Partido;
  historial_cargos: CargoPublico[];
  historial_candidaturas: Candidatura[];
  declaraciones: DeclaracionPatrimonio[];
  antecedentes: Antecedente[];
  vinculos: VinculoFamiliar[];
  financiacion: FinanciacionCampana[];
  alertas: Alerta[];
  /** @deprecated Use eoro_score instead */
  score: ScoreTransparencia;
  eoro_score: EoroScoreCache | null;
}

// --- Budget / Presupuesto ---

export interface EntidadPresupuestal {
  id: string;
  nombre: string;
  tipo: "ministerio" | "departamento_admin" | "corporacion" | "corte" | "organo_control" | "otro";
  rama_id: string;
  presupuesto_asignado: number;
  ejecutado: number;
  porcentaje_ejecucion: number;
  num_contratos: number;
  valor_contratos: number;
}

export interface RamaGobierno {
  id: string;
  nombre: string;
  presupuesto_total: number;
  porcentaje_pgn: number;
  entidades: EntidadPresupuestal[];
}

// --- Funcionario Profile (aggregated view) ---

export interface FuncionarioCompleto {
  persona: Persona;
  cargo_actual: CargoPublico;
  historial_cargos: CargoPublico[];
  declaraciones: DeclaracionPatrimonio[];
  antecedentes: Antecedente[];
  vinculos: VinculoFamiliar[];
}

// --- API Response Types ---

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  per_page: number;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// --- Filter Types ---

export interface CandidatoFilters {
  tipo?: Candidatura["tipo"];
  partido_id?: string;
  departamento?: string;
  busqueda?: string;
  orden?: "nombre" | "partido" | "alertas" | "patrimonio";
  orden_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface ContratoFilters {
  departamento?: string;
  entidad?: string;
  valor_min?: number;
  valor_max?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  estado?: Contrato["estado"];
  page?: number;
  per_page?: number;
}

// --- Dynasty (family trees) ---

export interface DynastyNode {
  id: string;
  label: string;
  role: string;
  generation: number;
  isMainCandidate: boolean;
  color: string;
}

export interface DynastyEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface DynastyData {
  nodes: DynastyNode[];
  edges: DynastyEdge[];
}
