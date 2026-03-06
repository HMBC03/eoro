import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { FuncionarioCompleto } from "@/lib/types";

export async function getAllFuncionarios(): Promise<FuncionarioCompleto[]> {
  const supabase = await createClient();

  const { data: personas } = await supabase
    .schema("eoro")
    .from("personas")
    .select("*")
    .eq("tipo", "funcionario");

  if (!personas?.length) return [];

  const personaIds = personas.map((p) => p.id);

  const [cargosRes, declRes, antRes, vincRes] = await Promise.all([
    supabase.schema("eoro").from("cargos_publicos").select("*").in("persona_id", personaIds).order("fecha_inicio", { ascending: false }),
    supabase.schema("eoro").from("declaraciones_patrimonio").select("*").in("persona_id", personaIds).order("anio"),
    supabase.schema("eoro").from("antecedentes").select("*").in("persona_id", personaIds),
    supabase.schema("eoro").from("vinculos_familiares").select("*").or(`persona_a_id.in.(${personaIds.join(",")}),persona_b_id.in.(${personaIds.join(",")})`),
  ]);

  const cargos = cargosRes.data ?? [];
  const declaraciones = declRes.data ?? [];
  const antecedentes = antRes.data ?? [];
  const vinculos = vincRes.data ?? [];

  return personas.map((p) => {
    const pCargos = cargos
      .filter((c) => c.persona_id === p.id)
      .map((c) => ({
        ...c,
        fecha_inicio: c.fecha_inicio,
        fecha_fin: c.fecha_fin,
      }));

    const cargoActual = pCargos.find((c) => !c.fecha_fin) ?? pCargos[0];

    return {
      persona: {
        ...p,
        redes_sociales: p.redes_sociales ?? {},
      },
      cargo_actual: cargoActual,
      historial_cargos: pCargos,
      declaraciones: declaraciones
        .filter((d) => d.persona_id === p.id)
        .map((d) => ({
          ...d,
          patrimonio_total: Number(d.patrimonio_total),
          ingresos_total: Number(d.ingresos_total),
          bienes_inmuebles_valor: Number(d.bienes_inmuebles_valor),
          vehiculos_valor: Number(d.vehiculos_valor),
          cuentas_bancarias_saldo: Number(d.cuentas_bancarias_saldo),
        })),
      antecedentes: antecedentes.filter((a) => a.persona_id === p.id),
      vinculos: vinculos.filter(
        (v) => v.persona_a_id === p.id || v.persona_b_id === p.id
      ),
    };
  }).filter((f) => f.cargo_actual);
}

export async function getFuncionarioById(id: string): Promise<FuncionarioCompleto | null> {
  const supabase = await createClient();

  const { data: persona } = await supabase
    .schema("eoro")
    .from("personas")
    .select("*")
    .eq("id", id)
    .single();

  if (!persona) return null;

  const [cargosRes, declRes, antRes, vincRes] = await Promise.all([
    supabase.schema("eoro").from("cargos_publicos").select("*").eq("persona_id", id).order("fecha_inicio", { ascending: false }),
    supabase.schema("eoro").from("declaraciones_patrimonio").select("*").eq("persona_id", id).order("anio"),
    supabase.schema("eoro").from("antecedentes").select("*").eq("persona_id", id),
    supabase.schema("eoro").from("vinculos_familiares").select("*").or(`persona_a_id.eq.${id},persona_b_id.eq.${id}`),
  ]);

  const pCargos = (cargosRes.data ?? []).map((c) => ({
    ...c,
    fecha_inicio: c.fecha_inicio,
    fecha_fin: c.fecha_fin,
  }));

  const cargoActual = pCargos.find((c) => !c.fecha_fin) ?? pCargos[0];
  if (!cargoActual) return null;

  return {
    persona: { ...persona, redes_sociales: persona.redes_sociales ?? {} },
    cargo_actual: cargoActual,
    historial_cargos: pCargos,
    declaraciones: (declRes.data ?? []).map((d) => ({
      ...d,
      patrimonio_total: Number(d.patrimonio_total),
      ingresos_total: Number(d.ingresos_total),
      bienes_inmuebles_valor: Number(d.bienes_inmuebles_valor),
      vehiculos_valor: Number(d.vehiculos_valor),
      cuentas_bancarias_saldo: Number(d.cuentas_bancarias_saldo),
    })),
    antecedentes: antRes.data ?? [],
    vinculos: vincRes.data ?? [],
  };
}

export async function buscarFuncionarios(query: string): Promise<FuncionarioCompleto[]> {
  const all = await getAllFuncionarios();
  const q = query.toLowerCase();
  return all.filter(
    (f) =>
      f.persona.nombre_completo.toLowerCase().includes(q) ||
      f.cargo_actual.entidad.toLowerCase().includes(q) ||
      f.cargo_actual.cargo.toLowerCase().includes(q) ||
      f.cargo_actual.departamento.toLowerCase().includes(q)
  );
}
