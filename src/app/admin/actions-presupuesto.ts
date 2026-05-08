"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./_lib/require-admin";

// ============================================================
// ENTIDADES DEL ESTADO (nuevo modelo)
// ============================================================

export async function createEntidad(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const nombre = formData.get("nombre") as string;
  const sigla = formData.get("sigla") as string;
  const categoria = formData.get("categoria") as string;
  const subcategoria = formData.get("subcategoria") as string;
  const nit = formData.get("nit") as string;
  const presupuesto_asignado = Number(formData.get("presupuesto_asignado")) || 0;
  const presupuesto_ejecutado = Number(formData.get("presupuesto_ejecutado")) || 0;
  const porcentaje_ejecucion = Number(formData.get("porcentaje_ejecucion")) || 0;
  const color_hex = formData.get("color_hex") as string || "#374151";

  if (!nombre || !categoria) return;

  await supabase.schema("eoro").from("entidad_estado").insert({
    nombre,
    sigla,
    categoria,
    subcategoria,
    nit,
    presupuesto_asignado,
    presupuesto_ejecutado,
    porcentaje_ejecucion,
    color_hex,
  });

  revalidatePath("/admin/entidades");
}

export async function updateEntidad(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("entidad_estado").update({
    nombre: formData.get("nombre") as string,
    sigla: formData.get("sigla") as string,
    categoria: formData.get("categoria") as string,
    subcategoria: formData.get("subcategoria") as string,
    nit: formData.get("nit") as string,
    presupuesto_asignado: Number(formData.get("presupuesto_asignado")) || 0,
    presupuesto_ejecutado: Number(formData.get("presupuesto_ejecutado")) || 0,
    porcentaje_ejecucion: Number(formData.get("porcentaje_ejecucion")) || 0,
    color_hex: formData.get("color_hex") as string,
  }).eq("id", id);
  revalidatePath("/admin/entidades");
}

export async function deleteEntidad(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("entidad_estado").delete().eq("id", id);
  revalidatePath("/admin/entidades");
}

// ============================================================
// SCORES TRANSPARENCIA
// ============================================================

export async function createScore(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_id = formData.get("persona_id") as string;
  const total = Number(formData.get("total")) || 0;
  const financiacion_reportada = Number(formData.get("financiacion_reportada")) || 0;
  const sin_antecedentes_disciplinarios = Number(formData.get("sin_antecedentes_disciplinarios")) || 0;
  const sin_responsabilidad_fiscal = Number(formData.get("sin_responsabilidad_fiscal")) || 0;
  const declaro_bienes = Number(formData.get("declaro_bienes")) || 0;
  const crecimiento_patrimonial_razonable = Number(formData.get("crecimiento_patrimonial_razonable")) || 0;
  const sin_familiares_vinculados = Number(formData.get("sin_familiares_vinculados")) || 0;
  const sin_cambios_partido = Number(formData.get("sin_cambios_partido")) || 0;
  const reporto_conflictos = Number(formData.get("reporto_conflictos")) || 0;

  if (!persona_id) return;

  await supabase.schema("eoro").from("scores_transparencia").insert({
    persona_id,
    total,
    financiacion_reportada,
    sin_antecedentes_disciplinarios,
    sin_responsabilidad_fiscal,
    declaro_bienes,
    crecimiento_patrimonial_razonable,
    sin_familiares_vinculados,
    sin_cambios_partido,
    reporto_conflictos,
  });

  revalidatePath("/admin/scores");
}

export async function updateScore(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("scores_transparencia").update({
    persona_id: formData.get("persona_id") as string,
    total: Number(formData.get("total")) || 0,
    financiacion_reportada: Number(formData.get("financiacion_reportada")) || 0,
    sin_antecedentes_disciplinarios: Number(formData.get("sin_antecedentes_disciplinarios")) || 0,
    sin_responsabilidad_fiscal: Number(formData.get("sin_responsabilidad_fiscal")) || 0,
    declaro_bienes: Number(formData.get("declaro_bienes")) || 0,
    crecimiento_patrimonial_razonable: Number(formData.get("crecimiento_patrimonial_razonable")) || 0,
    sin_familiares_vinculados: Number(formData.get("sin_familiares_vinculados")) || 0,
    sin_cambios_partido: Number(formData.get("sin_cambios_partido")) || 0,
    reporto_conflictos: Number(formData.get("reporto_conflictos")) || 0,
  }).eq("id", id);
  revalidatePath("/admin/scores");
}

export async function deleteScore(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("scores_transparencia").delete().eq("id", id);
  revalidatePath("/admin/scores");
}