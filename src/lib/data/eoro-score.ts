import "server-only";

import { createClient } from "@/lib/supabase/server";
import { calculateEoroScore } from "@/lib/eoro-score";
import type {
  EoroCategoria,
  EoroVariable,
  EoroEvaluacion,
  EoroReporteCiudadano,
  EoroScoreCache,
  EoroHistorial,
} from "@/lib/types";

/** Fetch all categories and active variables */
export async function getEoroCatalog() {
  const supabase = await createClient();
  const [catRes, varRes] = await Promise.all([
    supabase
      .schema("eoro")
      .from("eoro_categorias")
      .select("*")
      .order("orden"),
    supabase
      .schema("eoro")
      .from("eoro_variables")
      .select("*")
      .eq("activa", true)
      .order("orden"),
  ]);
  return {
    categorias: (catRes.data ?? []) as EoroCategoria[],
    variables: (varRes.data ?? []) as EoroVariable[],
  };
}

/** Fetch cached score for a persona */
export async function getEoroScoreForPersona(
  personaId: string
): Promise<EoroScoreCache | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("eoro_scores_cache")
    .select("*")
    .eq("persona_id", personaId)
    .maybeSingle();
  return data as EoroScoreCache | null;
}

/** Fetch all evaluations for a persona */
export async function getEvaluacionesForPersona(
  personaId: string
): Promise<EoroEvaluacion[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("eoro_evaluaciones")
    .select("*")
    .eq("persona_id", personaId)
    .order("fecha_deteccion", { ascending: false });
  return (data ?? []) as EoroEvaluacion[];
}

/** Fetch verified citizen reports for a persona */
export async function getReportesVerificadosForPersona(
  personaId: string
): Promise<EoroReporteCiudadano[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("eoro_reportes_ciudadanos")
    .select("*")
    .eq("persona_id", personaId)
    .eq("estado", "verificado")
    .order("created_at", { ascending: false });
  return (data ?? []) as EoroReporteCiudadano[];
}

/** Fetch score history timeline for a persona */
export async function getHistorialForPersona(
  personaId: string
): Promise<EoroHistorial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("eoro_historial")
    .select("*")
    .eq("persona_id", personaId)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as EoroHistorial[];
}

/** Recalculate and persist score for a persona */
export async function recalculateEoroScore(
  personaId: string
): Promise<EoroScoreCache> {
  const supabase = await createClient();

  const [{ categorias, variables }, evaluaciones, reportes] = await Promise.all(
    [
      getEoroCatalog(),
      getEvaluacionesForPersona(personaId),
      getReportesVerificadosForPersona(personaId),
    ]
  );

  const result = calculateEoroScore(categorias, variables, evaluaciones, reportes);
  result.persona_id = personaId;

  // Get previous score for history
  const { data: prev } = await supabase
    .schema("eoro")
    .from("eoro_scores_cache")
    .select("score_total")
    .eq("persona_id", personaId)
    .maybeSingle();

  const previousScore = prev?.score_total ?? 100;

  // Upsert cache
  await supabase.schema("eoro").from("eoro_scores_cache").upsert(
    {
      persona_id: personaId,
      score_total: result.score_total,
      desglose_categorias: result.desglose_categorias,
      num_evaluaciones: result.num_evaluaciones,
      num_reportes_verificados: result.num_reportes_verificados,
      calculated_at: new Date().toISOString(),
    },
    { onConflict: "persona_id" }
  );

  // Record history if score changed
  if (previousScore !== result.score_total) {
    await supabase.schema("eoro").from("eoro_historial").insert({
      persona_id: personaId,
      score_anterior: previousScore,
      score_nuevo: result.score_total,
      evento: "recalculo",
      detalle: `Recalculo: ${previousScore} → ${result.score_total}`,
    });
  }

  return result;
}

/** Fetch cached scores for multiple personas (batch) */
export async function getEoroScoresBatch(
  personaIds: string[]
): Promise<Map<string, EoroScoreCache>> {
  if (personaIds.length === 0) return new Map();
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("eoro_scores_cache")
    .select("*")
    .in("persona_id", personaIds);

  const map = new Map<string, EoroScoreCache>();
  for (const row of data ?? []) {
    map.set(row.persona_id, row as EoroScoreCache);
  }
  return map;
}
