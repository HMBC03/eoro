import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { RamaGobierno, EntidadPresupuestal } from "@/lib/types";

const PGN_TOTAL = 523_000_000_000_000;

export async function getPresupuestoData() {
  const supabase = await createClient();

  const [ramasRes, entidadesRes, contratosRes] = await Promise.all([
    supabase.schema("eoro").from("ramas_gobierno").select("*").order("nombre"),
    supabase.schema("eoro").from("entidades_presupuestales").select("*").order("nombre"),
    supabase.schema("eoro").from("contratos").select("id, entidad_nombre, valor_contrato"),
  ]);

  const rawRamas = ramasRes.data ?? [];
  const rawEntidades = entidadesRes.data ?? [];
  const rawContratos = contratosRes.data ?? [];

  // Cross-reference contratos → entidades
  const contratosByEntidad = new Map<string, { count: number; valor: number }>();
  for (const c of rawContratos) {
    const existing = contratosByEntidad.get(c.entidad_nombre) ?? { count: 0, valor: 0 };
    existing.count++;
    existing.valor += Number(c.valor_contrato);
    contratosByEntidad.set(c.entidad_nombre, existing);
  }

  const entidadesByRama = new Map<string, EntidadPresupuestal[]>();
  for (const e of rawEntidades) {
    const stats = contratosByEntidad.get(e.nombre) ?? { count: 0, valor: 0 };
    const entidad: EntidadPresupuestal = {
      id: e.id,
      nombre: e.nombre,
      tipo: e.tipo,
      rama_id: e.rama_id,
      presupuesto_asignado: Number(e.presupuesto_asignado),
      ejecutado: Number(e.ejecutado),
      porcentaje_ejecucion: Number(e.porcentaje_ejecucion),
      num_contratos: stats.count,
      valor_contratos: stats.valor,
    };
    const arr = entidadesByRama.get(e.rama_id) ?? [];
    arr.push(entidad);
    entidadesByRama.set(e.rama_id, arr);
  }

  const ramas: RamaGobierno[] = rawRamas.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    presupuesto_total: Number(r.presupuesto_total),
    porcentaje_pgn: Number(r.porcentaje_pgn),
    entidades: entidadesByRama.get(r.id) ?? [],
  }));

  // Stats
  const allEntidades = ramas.flatMap((r) => r.entidades);
  const ejecucionPromedio = allEntidades.length > 0
    ? Math.round(allEntidades.reduce((s, e) => s + e.porcentaje_ejecucion, 0) / allEntidades.length)
    : 0;
  const totalContratos = allEntidades.reduce((s, e) => s + e.num_contratos, 0);
  const topEntidades = [...allEntidades]
    .sort((a, b) => b.presupuesto_asignado - a.presupuesto_asignado)
    .slice(0, 10);

  return {
    pgn_total: PGN_TOTAL,
    ramas,
    stats: {
      pgn_total: PGN_TOTAL,
      ejecucion_promedio: ejecucionPromedio,
      entidades_total: allEntidades.length,
      total_contratos: totalContratos,
      top_entidades: topEntidades,
    },
  };
}

export async function getContratosByEntidad(entidadNombre: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("contratos")
    .select("*, contrato_votos(votos_valida, votos_cuestiona)")
    .eq("entidad_nombre", entidadNombre);

  return (data ?? []).map((c) => ({
    ...c,
    valor_contrato: Number(c.valor_contrato),
    valor_adiciones: Number(c.valor_adiciones),
    votos_valida: c.contrato_votos?.[0]?.votos_valida ?? 0,
    votos_cuestiona: c.contrato_votos?.[0]?.votos_cuestiona ?? 0,
  }));
}
