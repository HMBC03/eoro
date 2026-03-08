// ============================================================
// Eoro Score — Pure calculation functions (no DB, no side effects)
// ============================================================

import { EORO_SCORE_TIERS, EORO_RESTORATION_RULES } from "./constants";
import type {
  EoroCategoria,
  EoroVariable,
  EoroEvaluacion,
  EoroReporteCiudadano,
  EoroScoreCache,
  EoroScoreTier,
} from "./types";

/**
 * Calculate the Eoro Score from raw evaluations.
 *
 * Logic:
 * 1. Start at 100
 * 2. For each active evaluation, subtract puntos_restados
 * 3. For resolved evaluations, apply restoration rule
 * 4. Subtract verified citizen report impact
 * 5. Clamp each category to its peso_max
 * 6. Clamp total to 0 minimum
 */
export function calculateEoroScore(
  categorias: EoroCategoria[],
  variables: EoroVariable[],
  evaluaciones: EoroEvaluacion[],
  reportesVerificados: EoroReporteCiudadano[]
): EoroScoreCache {
  // Build category desglose
  const desglose: Record<string, { max: number; restado: number }> = {};
  for (const cat of categorias) {
    desglose[cat.slug] = { max: cat.peso_max, restado: 0 };
  }

  // Map variable_id -> category slug
  const variableCatMap = new Map<string, string>();
  for (const v of variables) {
    const cat = categorias.find((c) => c.id === v.categoria_id);
    if (cat) variableCatMap.set(v.id, cat.slug);
  }

  // Process evaluations
  for (const ev of evaluaciones) {
    const catSlug = variableCatMap.get(ev.variable_id);
    if (!catSlug || !desglose[catSlug]) continue;

    let effectivePenalty = ev.puntos_restados;

    // If resolved, apply restoration
    if (
      ev.fecha_resolucion &&
      ev.resolucion_tipo &&
      ev.resolucion_tipo !== "vigente"
    ) {
      const restoration = EORO_RESTORATION_RULES[ev.resolucion_tipo] ?? 0;
      effectivePenalty = Math.round(ev.puntos_restados * (1 - restoration));
    }

    desglose[catSlug].restado += effectivePenalty;
  }

  // Process verified citizen reports
  const reportesCatSlug = "reporte_ciudadano";
  if (desglose[reportesCatSlug]) {
    for (const r of reportesVerificados) {
      desglose[reportesCatSlug].restado += r.impacto_score;
    }
  }

  // Clamp each category to its max
  for (const key of Object.keys(desglose)) {
    desglose[key].restado = Math.min(desglose[key].restado, desglose[key].max);
  }

  // Calculate total
  const totalRestado = Object.values(desglose).reduce(
    (sum, d) => sum + d.restado,
    0
  );
  const scoreTotal = Math.max(0, 100 - totalRestado);

  return {
    persona_id: "", // caller fills this
    score_total: scoreTotal,
    desglose_categorias: desglose,
    num_evaluaciones: evaluaciones.length,
    num_reportes_verificados: reportesVerificados.length,
    calculated_at: new Date().toISOString(),
  };
}

/** Get the tier object for a given score */
export function getEoroTier(
  score: number
): (typeof EORO_SCORE_TIERS)[number] {
  return (
    EORO_SCORE_TIERS.find((t) => score >= t.min && score <= t.max) ??
    EORO_SCORE_TIERS[EORO_SCORE_TIERS.length - 1]
  );
}

/** Get tier slug for a given score */
export function getEoroTierSlug(score: number): EoroScoreTier {
  return getEoroTier(score).slug;
}
