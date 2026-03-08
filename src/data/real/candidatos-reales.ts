// ============================================================
// Real candidate data from "Listado definitivo candidatos Congreso 2026"
// Source: Registraduria Nacional — 2,844 candidates
// ============================================================

import type {
  Persona,
  Candidatura,
  CandidatoCompleto,
  Partido,
  ScoreTransparencia,
} from "@/lib/types";
import rawData from "./candidatos_congreso_2026.json";
import { normalizeAgrupacion, type PartidoNormalizado } from "./partidos-normalizados";

// --- Raw record type matching JSON ---

interface RawCandidato {
  departamento: string;
  corporacion: string;
  circunscripcion: string;
  tipo_agrupacion: string;
  agrupacion: string;
  opcion_voto: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  renglon: string | number;
}

// --- Helpers ---

function buildId(prefix: string, index: number): string {
  return `${prefix}${String(index).padStart(4, "0")}`;
}

function buildNombreCompleto(r: RawCandidato): string {
  const parts = [r.primer_nombre, r.segundo_nombre, r.primer_apellido, r.segundo_apellido]
    .map((s) => s.trim())
    .filter(Boolean);
  return titleCase(parts.join(" "));
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeDepartamento(dep: string): string {
  const map: Record<string, string> = {
    "COLOMBIA": "Colombia",
    "BOGOTA D.C.": "Bogota D.C.",
    "ATLANTICO": "Atlantico",
    "BOLIVAR": "Bolivar",
    "BOYACA": "Boyaca",
    "CAQUETA": "Caqueta",
    "CORDOBA": "Cordoba",
    "GUAINIA": "Guainia",
    "LA GUAJIRA": "La Guajira",
    "NARIÑO": "Narino",
    "NORTE DE SANTANDER": "Norte de Santander",
    "QUINDIO": "Quindio",
    "SAN ANDRES": "San Andres",
    "VAUPES": "Vaupes",
    "CONSULADOS": "Internacional",
  };
  return map[dep] || titleCase(dep);
}

function corporacionToTipo(corp: string): Candidatura["tipo"] {
  const upper = corp.toUpperCase();
  if (upper.includes("SENADO")) return "senado";
  if (upper.includes("CÁMARA") || upper.includes("CAMARA")) return "camara";
  return "senado";
}

function partidoNormToPartido(pn: PartidoNormalizado): Partido {
  return {
    id: pn.id,
    nombre: pn.nombre,
    sigla: pn.sigla,
    color_hex: pn.color_hex,
    logo_url: null,
    personeria_juridica: true,
    activo: true,
    ideologia: pn.familia,
  };
}

/**
 * Generate a deterministic "unknown" score for real candidates
 * (no detailed data available yet — score reflects that)
 */
function buildPendingScore(personaId: string): ScoreTransparencia {
  return {
    persona_id: personaId,
    total: 0,
    desglose: {
      financiacion_reportada: 0,
      sin_antecedentes_disciplinarios: 0,
      sin_responsabilidad_fiscal: 0,
      declaro_bienes: 0,
      crecimiento_patrimonial_razonable: 0,
      sin_familiares_vinculados: 0,
      sin_cambios_partido: 0,
      reporto_conflictos: 0,
    },
  };
}

// --- Build all candidates ---

function processRawRecords(
  records: RawCandidato[],
  corporacion: "senado" | "camara"
): CandidatoCompleto[] {
  return records.map((r, idx) => {
    const id = buildId(corporacion === "senado" ? "rs" : "rc", idx + 1);
    const nombreCompleto = buildNombreCompleto(r);
    const partidoNorm = normalizeAgrupacion(r.agrupacion);

    const persona: Persona = {
      id,
      cedula: "",
      nombre_completo: nombreCompleto,
      fecha_nacimiento: "",
      departamento_origen: normalizeDepartamento(r.departamento),
      foto_url: null,
      biografia: "",
      redes_sociales: {},
      created_at: "2026-01-01",
      updated_at: "2026-03-01",
    };

    const candidatura: Candidatura = {
      id: `cand-${id}`,
      persona_id: id,
      eleccion_year: 2026,
      tipo: corporacionToTipo(r.corporacion),
      partido_id: partidoNorm.id,
      circunscripcion: titleCase(r.circunscripcion),
      votos_obtenidos: null,
      elegido: false,
      estado: "inscrito",
      fuente: "Registraduria Nacional",
    };

    return {
      persona,
      candidatura_actual: candidatura,
      partido: partidoNormToPartido(partidoNorm),
      historial_cargos: [],
      historial_candidaturas: [candidatura],
      declaraciones: [],
      antecedentes: [],
      vinculos: [],
      financiacion: [],
      alertas: [],
      score: buildPendingScore(id),
      // Extra metadata for filtering
      _meta: {
        agrupacion_original: r.agrupacion,
        tipo_agrupacion: r.tipo_agrupacion,
        opcion_voto: r.opcion_voto,
        renglon: Number(r.renglon) || 0,
      },
    } as CandidatoCompleto & { _meta: Record<string, unknown> };
  });
}

// --- Cached data ---

let _allCandidatos: CandidatoCompleto[] | null = null;

/**
 * Get all real candidates from the 2026 Congress election.
 * Returns 2,844 CandidatoCompleto records.
 */
export function getAllCandidatosReales(): CandidatoCompleto[] {
  if (_allCandidatos) return _allCandidatos;

  const senado = processRawRecords(rawData.senado as RawCandidato[], "senado");
  const camara = processRawRecords(rawData.camara as RawCandidato[], "camara");
  _allCandidatos = [...senado, ...camara];
  return _allCandidatos;
}

/**
 * Get a single real candidate by ID.
 */
export function getCandidatoRealById(id: string): CandidatoCompleto | undefined {
  return getAllCandidatosReales().find((c) => c.persona.id === id);
}

/**
 * Get unique departments from real data.
 */
export function getDepartamentosReales(): string[] {
  const deps = new Set(getAllCandidatosReales().map((c) => c.persona.departamento_origen));
  return [...deps].sort();
}

/**
 * Get unique normalized parties from real data.
 */
export function getPartidosReales(): Partido[] {
  const seen = new Map<string, Partido>();
  for (const c of getAllCandidatosReales()) {
    if (!seen.has(c.partido.id)) {
      seen.set(c.partido.id, c.partido);
    }
  }
  return [...seen.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
}
