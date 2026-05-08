import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CandidatoCompleto, ScoreTransparencia, EoroScoreCache } from "@/lib/types";
import {
  getPresidenciales2026,
  getPresidencialById as getMockPresidencialById,
} from "@/data/mock/presidenciales-2026";

export async function getAllPresidenciales(): Promise<CandidatoCompleto[]> {
  const [mock, supabaseResults] = await Promise.all([
    Promise.resolve(getPresidenciales2026()),
    getPresidencialesFromSupabase(),
  ]);
  return [...supabaseResults, ...mock];
}

export async function getPresidencialById(id: string): Promise<CandidatoCompleto | null> {
  const mock = getMockPresidencialById(id);
  if (mock) return mock;

  const supabase = await createClient();
  const { data: persona } = await supabase
    .schema("eoro")
    .from("personas")
    .select("*")
    .eq("id", id)
    .single();

  if (!persona) return null;

  const [candRes, cargosRes, declRes, antRes, vincRes, alertasRes, scoresRes, eoroRes] =
    await Promise.all([
      supabase
        .schema("eoro")
        .from("candidaturas")
        .select("*, partidos(*)")
        .eq("persona_id", id)
        .order("eleccion_year", { ascending: false }),
      supabase
        .schema("eoro")
        .from("cargos_publicos")
        .select("*")
        .eq("persona_id", id)
        .order("fecha_inicio", { ascending: false }),
      supabase
        .schema("eoro")
        .from("declaraciones_patrimonio")
        .select("*")
        .eq("persona_id", id)
        .order("anio"),
      supabase
        .schema("eoro")
        .from("antecedentes")
        .select("*")
        .eq("persona_id", id),
      supabase
        .schema("eoro")
        .from("vinculos_familiares")
        .select("*")
        .or(`persona_a_id.eq.${id},persona_b_id.eq.${id}`),
      supabase
        .schema("eoro")
        .from("alertas")
        .select("*")
        .eq("persona_id", id),
      supabase
        .schema("eoro")
        .from("scores_transparencia")
        .select("*")
        .eq("persona_id", id)
        .maybeSingle(),
      supabase
        .schema("eoro")
        .from("eoro_scores_cache")
        .select("*")
        .eq("persona_id", id)
        .maybeSingle(),
    ]);

  const candidaturas = candRes.data ?? [];
  const candActual = candidaturas[0];
  if (!candActual?.partidos) return null;

  const candIds = candidaturas.map((c) => c.id);
  const { data: financiacion } =
    candIds.length > 0
      ? await supabase
          .schema("eoro")
          .from("financiacion_campana")
          .select("*")
          .in("candidatura_id", candIds)
      : { data: [] };

  const antecedentes = antRes.data ?? [];
  const declaraciones = (declRes.data ?? []).map((d) => ({
    ...d,
    patrimonio_total: Number(d.patrimonio_total),
    ingresos_total: Number(d.ingresos_total),
    bienes_inmuebles_valor: Number(d.bienes_inmuebles_valor),
    vehiculos_valor: Number(d.vehiculos_valor),
    cuentas_bancarias_saldo: Number(d.cuentas_bancarias_saldo),
  }));
  const vinculos = vincRes.data ?? [];
  const finArr = (financiacion ?? []).map((f) => ({
    ...f,
    valor: Number(f.valor),
  }));

  const scoreRow = scoresRes.data;
  const score: ScoreTransparencia = scoreRow
    ? {
        persona_id: scoreRow.persona_id,
        total: scoreRow.total,
        desglose: {
          financiacion_reportada: scoreRow.financiacion_reportada,
          sin_antecedentes_disciplinarios:
            scoreRow.sin_antecedentes_disciplinarios,
          sin_responsabilidad_fiscal: scoreRow.sin_responsabilidad_fiscal,
          declaro_bienes: scoreRow.declaro_bienes,
          crecimiento_patrimonial_razonable:
            scoreRow.crecimiento_patrimonial_razonable,
          sin_familiares_vinculados: scoreRow.sin_familiares_vinculados,
          sin_cambios_partido: scoreRow.sin_cambios_partido,
          reporto_conflictos: scoreRow.reporto_conflictos,
        },
      }
    : {
        persona_id: persona.id,
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

  return {
    persona: { ...persona, redes_sociales: persona.redes_sociales ?? {} },
    candidatura_actual: { ...candActual, partido_id: candActual.partido_id },
    partido: {
      ...candActual.partidos,
      logo_url: candActual.partidos.logo_url ?? null,
    },
    historial_cargos: cargosRes.data ?? [],
    historial_candidaturas: candidaturas,
    declaraciones,
    antecedentes,
    vinculos,
    financiacion: finArr,
    alertas: (alertasRes.data ?? []).map((a) => ({
      ...a,
      datos_soporte: a.datos_soporte ?? {},
    })),
    score,
    eoro_score: (eoroRes.data as EoroScoreCache) ?? null,
  };
}

async function getPresidencialesFromSupabase(): Promise<CandidatoCompleto[]> {
  const supabase = await createClient();
  const { data: candidaturas } = await supabase
    .schema("eoro")
    .from("candidaturas")
    .select("*, partidos(*), personas(*)")
    .eq("tipo", "presidencia")
    .eq("eleccion_year", 2026)
    .eq("estado", "inscrito");

  if (!candidaturas?.length) return [];

  const results: CandidatoCompleto[] = [];
  for (const cand of candidaturas) {
    if (!cand.personas || !cand.partidos) continue;
    const persona = cand.personas;

    results.push({
      persona: { ...persona, redes_sociales: persona.redes_sociales ?? {} },
      candidatura_actual: { ...cand, partido_id: cand.partido_id },
      partido: {
        ...cand.partidos,
        logo_url: cand.partidos.logo_url ?? null,
      },
      historial_cargos: [],
      historial_candidaturas: [cand],
      declaraciones: [],
      antecedentes: [],
      vinculos: [],
      financiacion: [],
      alertas: [],
      score: {
        persona_id: persona.id,
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
      },
      eoro_score: null,
    });
  }

  return results;
}
