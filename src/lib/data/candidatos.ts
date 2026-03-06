import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CandidatoCompleto, ScoreTransparencia } from "@/lib/types";
import { getAllCandidatosReales, getPartidosReales, getDepartamentosReales, getCandidatoRealById } from "@/data/real/candidatos-reales";
import { getAlertasByPersona } from "./alertas";

export async function getCandidatosMock(): Promise<CandidatoCompleto[]> {
  const supabase = await createClient();

  const { data: personas } = await supabase
    .schema("eoro")
    .from("personas")
    .select("*")
    .eq("tipo", "candidato");

  if (!personas?.length) return [];

  const personaIds = personas.map((p) => p.id);

  const [candRes, cargosRes, declRes, antRes, vincRes, finRes, alertasRes, scoresRes] = await Promise.all([
    supabase.schema("eoro").from("candidaturas").select("*, partidos(*)").in("persona_id", personaIds).order("eleccion_year", { ascending: false }),
    supabase.schema("eoro").from("cargos_publicos").select("*").in("persona_id", personaIds).order("fecha_inicio", { ascending: false }),
    supabase.schema("eoro").from("declaraciones_patrimonio").select("*").in("persona_id", personaIds).order("anio"),
    supabase.schema("eoro").from("antecedentes").select("*").in("persona_id", personaIds),
    supabase.schema("eoro").from("vinculos_familiares").select("*").or(`persona_a_id.in.(${personaIds.join(",")}),persona_b_id.in.(${personaIds.join(",")})`),
    supabase.schema("eoro").from("financiacion_campana").select("*, candidaturas!inner(persona_id)").in("candidaturas.persona_id", personaIds),
    supabase.schema("eoro").from("alertas").select("*").in("persona_id", personaIds),
    supabase.schema("eoro").from("scores_transparencia").select("*").in("persona_id", personaIds),
  ]);

  const candidaturas = candRes.data ?? [];
  const cargos = cargosRes.data ?? [];
  const declaraciones = declRes.data ?? [];
  const antecedentes = antRes.data ?? [];
  const vinculos = vincRes.data ?? [];
  const financiacion = finRes.data ?? [];
  const alertas = alertasRes.data ?? [];
  const scores = scoresRes.data ?? [];

  const results: CandidatoCompleto[] = [];

  for (const persona of personas) {
    const pCands = candidaturas.filter((c) => c.persona_id === persona.id);
    const candActual = pCands[0]; // most recent
    if (!candActual) continue;

    const partido = candActual.partidos;
    if (!partido) continue;

    const pFinanciacion = financiacion.filter(
      (f) => (f.candidaturas as { persona_id: string })?.persona_id === persona.id
    );

    const scoreRow = scores.find((s) => s.persona_id === persona.id);
    const score: ScoreTransparencia = scoreRow
      ? {
          persona_id: scoreRow.persona_id,
          total: scoreRow.total,
          desglose: {
            financiacion_reportada: scoreRow.financiacion_reportada,
            sin_antecedentes_disciplinarios: scoreRow.sin_antecedentes_disciplinarios,
            sin_responsabilidad_fiscal: scoreRow.sin_responsabilidad_fiscal,
            declaro_bienes: scoreRow.declaro_bienes,
            crecimiento_patrimonial_razonable: scoreRow.crecimiento_patrimonial_razonable,
            sin_familiares_vinculados: scoreRow.sin_familiares_vinculados,
            sin_cambios_partido: scoreRow.sin_cambios_partido,
            reporto_conflictos: scoreRow.reporto_conflictos,
          },
        }
      : buildDefaultScore(persona.id, pCands, antecedentes.filter((a) => a.persona_id === persona.id), declaraciones.filter((d) => d.persona_id === persona.id), vinculos.filter((v) => v.persona_a_id === persona.id || v.persona_b_id === persona.id), pFinanciacion);

    results.push({
      persona: { ...persona, redes_sociales: persona.redes_sociales ?? {} },
      candidatura_actual: {
        ...candActual,
        partido_id: candActual.partido_id,
      },
      partido: {
        ...partido,
        logo_url: partido.logo_url ?? null,
      },
      historial_cargos: cargos.filter((c) => c.persona_id === persona.id),
      historial_candidaturas: pCands,
      declaraciones: declaraciones
        .filter((d) => d.persona_id === persona.id)
        .map((d) => ({
          ...d,
          patrimonio_total: Number(d.patrimonio_total),
          ingresos_total: Number(d.ingresos_total),
          bienes_inmuebles_valor: Number(d.bienes_inmuebles_valor),
          vehiculos_valor: Number(d.vehiculos_valor),
          cuentas_bancarias_saldo: Number(d.cuentas_bancarias_saldo),
        })),
      antecedentes: antecedentes.filter((a) => a.persona_id === persona.id),
      vinculos: vinculos.filter(
        (v) => v.persona_a_id === persona.id || v.persona_b_id === persona.id
      ),
      financiacion: pFinanciacion.map((f) => ({
        ...f,
        valor: Number(f.valor),
        candidatura_id: f.candidatura_id,
      })),
      alertas: alertas
        .filter((a) => a.persona_id === persona.id)
        .map((a) => ({ ...a, datos_soporte: a.datos_soporte ?? {} })),
      score,
    });
  }

  return results;
}

export async function getAllCandidatos(): Promise<CandidatoCompleto[]> {
  const [mock, real] = await Promise.all([
    getCandidatosMock(),
    Promise.resolve(getAllCandidatosReales()),
  ]);
  return [...mock, ...real];
}

export async function getCandidatoById(id: string): Promise<CandidatoCompleto | null> {
  // Try real candidates first (cheaper)
  const real = getCandidatoRealById(id);
  if (real) return real;

  // Then try Supabase
  const supabase = await createClient();
  const { data: persona } = await supabase
    .schema("eoro")
    .from("personas")
    .select("*")
    .eq("id", id)
    .single();

  if (!persona) return null;

  const [candRes, cargosRes, declRes, antRes, vincRes, alertasRes, scoresRes] = await Promise.all([
    supabase.schema("eoro").from("candidaturas").select("*, partidos(*)").eq("persona_id", id).order("eleccion_year", { ascending: false }),
    supabase.schema("eoro").from("cargos_publicos").select("*").eq("persona_id", id).order("fecha_inicio", { ascending: false }),
    supabase.schema("eoro").from("declaraciones_patrimonio").select("*").eq("persona_id", id).order("anio"),
    supabase.schema("eoro").from("antecedentes").select("*").eq("persona_id", id),
    supabase.schema("eoro").from("vinculos_familiares").select("*").or(`persona_a_id.eq.${id},persona_b_id.eq.${id}`),
    supabase.schema("eoro").from("alertas").select("*").eq("persona_id", id),
    supabase.schema("eoro").from("scores_transparencia").select("*").eq("persona_id", id).maybeSingle(),
  ]);

  const candidaturas = candRes.data ?? [];
  const candActual = candidaturas[0];
  if (!candActual?.partidos) return null;

  // Financiacion for all candidaturas
  const candIds = candidaturas.map((c) => c.id);
  const { data: financiacion } = candIds.length > 0
    ? await supabase.schema("eoro").from("financiacion_campana").select("*").in("candidatura_id", candIds)
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
  const finArr = (financiacion ?? []).map((f) => ({ ...f, valor: Number(f.valor) }));

  const scoreRow = scoresRes.data;
  const score: ScoreTransparencia = scoreRow
    ? {
        persona_id: scoreRow.persona_id,
        total: scoreRow.total,
        desglose: {
          financiacion_reportada: scoreRow.financiacion_reportada,
          sin_antecedentes_disciplinarios: scoreRow.sin_antecedentes_disciplinarios,
          sin_responsabilidad_fiscal: scoreRow.sin_responsabilidad_fiscal,
          declaro_bienes: scoreRow.declaro_bienes,
          crecimiento_patrimonial_razonable: scoreRow.crecimiento_patrimonial_razonable,
          sin_familiares_vinculados: scoreRow.sin_familiares_vinculados,
          sin_cambios_partido: scoreRow.sin_cambios_partido,
          reporto_conflictos: scoreRow.reporto_conflictos,
        },
      }
    : buildDefaultScore(persona.id, candidaturas, antecedentes, declaraciones, vinculos, finArr);

  return {
    persona: { ...persona, redes_sociales: persona.redes_sociales ?? {} },
    candidatura_actual: { ...candActual, partido_id: candActual.partido_id },
    partido: { ...candActual.partidos, logo_url: candActual.partidos.logo_url ?? null },
    historial_cargos: cargosRes.data ?? [],
    historial_candidaturas: candidaturas,
    declaraciones,
    antecedentes,
    vinculos,
    financiacion: finArr,
    alertas: (alertasRes.data ?? []).map((a) => ({ ...a, datos_soporte: a.datos_soporte ?? {} })),
    score,
  };
}

// Re-export real candidates helpers (server-only)
export { getPartidosReales, getDepartamentosReales } from "@/data/real/candidatos-reales";

// --- Default score calculator (when no score in DB) ---
function buildDefaultScore(
  personaId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  candidaturas: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  antecedentes: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declaraciones: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vinculos: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  financiacion: any[]
): ScoreTransparencia {
  const desglose = {
    financiacion_reportada: financiacion.length > 0 ? 20 : 0,
    sin_antecedentes_disciplinarios: antecedentes.some((a) => a.tipo === "disciplinario" && a.estado === "vigente") ? 0 : 15,
    sin_responsabilidad_fiscal: antecedentes.some((a) => a.tipo === "fiscal" && a.estado === "vigente") ? 0 : 15,
    declaro_bienes: declaraciones.length > 0 ? 15 : 0,
    crecimiento_patrimonial_razonable: 10,
    sin_familiares_vinculados: vinculos.length === 0 ? 10 : 5,
    sin_cambios_partido: new Set(candidaturas.map((c) => c.partido_id)).size <= 1 ? 10 : 0,
    reporto_conflictos: declaraciones.some((d) => (d.conflictos_interes?.length ?? 0) > 0) ? 5 : 0,
  };

  return {
    persona_id: personaId,
    total: Object.values(desglose).reduce((s, v) => s + v, 0),
    desglose,
  };
}
