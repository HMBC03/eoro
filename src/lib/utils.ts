import type { ScoreTransparencia, CandidatoCompleto } from "./types";
import { SCORE_WEIGHTS } from "./constants";

/**
 * Concatenate class names, filtering out falsy values.
 * Simple alternative to clsx/classnames.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Calculate transparency score for a candidate.
 * Returns a score from 0-100 based on weighted criteria.
 */
export function calculateScore(
  candidato: CandidatoCompleto
): ScoreTransparencia {
  const desglose = {
    financiacion_reportada:
      candidato.financiacion.length > 0
        ? SCORE_WEIGHTS.financiacion_reportada
        : 0,

    sin_antecedentes_disciplinarios: candidato.antecedentes.filter(
      (a) => a.tipo === "disciplinario" && a.estado === "vigente"
    ).length === 0
      ? SCORE_WEIGHTS.sin_antecedentes_disciplinarios
      : 0,

    sin_responsabilidad_fiscal: candidato.antecedentes.filter(
      (a) => a.tipo === "fiscal" && a.estado === "vigente"
    ).length === 0
      ? SCORE_WEIGHTS.sin_responsabilidad_fiscal
      : 0,

    declaro_bienes:
      candidato.declaraciones.length > 0 ? SCORE_WEIGHTS.declaro_bienes : 0,

    crecimiento_patrimonial_razonable: (() => {
      if (candidato.declaraciones.length < 2)
        return SCORE_WEIGHTS.crecimiento_patrimonial_razonable;
      const sorted = [...candidato.declaraciones].sort(
        (a, b) => a.anio - b.anio
      );
      const first = sorted[0].patrimonio_total;
      const last = sorted[sorted.length - 1].patrimonio_total;
      if (first === 0) return SCORE_WEIGHTS.crecimiento_patrimonial_razonable;
      const growth = ((last - first) / first) * 100;
      return growth <= 100
        ? SCORE_WEIGHTS.crecimiento_patrimonial_razonable
        : 0;
    })(),

    sin_familiares_vinculados:
      candidato.vinculos.length === 0
        ? SCORE_WEIGHTS.sin_familiares_vinculados
        : 0,

    sin_cambios_partido: (() => {
      const partidos = new Set(
        candidato.historial_candidaturas.map((c) => c.partido_id)
      );
      return partidos.size <= 1 ? SCORE_WEIGHTS.sin_cambios_partido : 0;
    })(),

    reporto_conflictos:
      candidato.declaraciones.some((d) => d.conflictos_interes.length > 0)
        ? SCORE_WEIGHTS.reporto_conflictos
        : 0,
  };

  const total = Object.values(desglose).reduce((sum, val) => sum + val, 0);

  return {
    persona_id: candidato.persona.id,
    total,
    desglose,
  };
}

/**
 * Get the color class for a transparency score.
 */
export function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

/**
 * Get the background color class for a transparency score.
 */
export function getScoreBgColor(score: number): string {
  if (score >= 75) return "bg-green-100";
  if (score >= 50) return "bg-amber-100";
  return "bg-red-100";
}

/**
 * Generate initials from a full name (for avatar fallbacks).
 * "Juan Carlos Rodriguez" -> "JR"
 */
export function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
