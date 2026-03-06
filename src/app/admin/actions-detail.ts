"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./_lib/require-admin";

// ============================================================
// DECLARACIONES PATRIMONIO
// ============================================================

export async function createDeclaracion(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_id = formData.get("persona_id") as string;
  const anio = Number(formData.get("anio")) || 0;
  const patrimonio_total = Number(formData.get("patrimonio_total")) || 0;
  const ingresos_total = Number(formData.get("ingresos_total")) || 0;
  const bienes_inmuebles_valor = Number(formData.get("bienes_inmuebles_valor")) || 0;
  const vehiculos_valor = Number(formData.get("vehiculos_valor")) || 0;
  const cuentas_bancarias_saldo = Number(formData.get("cuentas_bancarias_saldo")) || 0;

  if (!persona_id || !anio) return;

  await supabase.schema("eoro").from("declaraciones_patrimonio").insert({
    persona_id,
    anio,
    patrimonio_total,
    ingresos_total,
    bienes_inmuebles_valor,
    vehiculos_valor,
    cuentas_bancarias_saldo,
    conflictos_interes: [],
    fuente: "manual",
  });

  revalidatePath("/admin/declaraciones");
}

export async function deleteDeclaracion(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("declaraciones_patrimonio").delete().eq("id", id);
  revalidatePath("/admin/declaraciones");
}

// ============================================================
// ANTECEDENTES
// ============================================================

export async function createAntecedente(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_id = formData.get("persona_id") as string;
  const tipo = formData.get("tipo") as string;
  const estado = formData.get("estado") as string;
  const descripcion = formData.get("descripcion") as string;
  const entidad_reporta = formData.get("entidad_reporta") as string;
  const fecha_sancion = (formData.get("fecha_sancion") as string) || null;
  const fecha_vencimiento = (formData.get("fecha_vencimiento") as string) || null;

  if (!persona_id || !tipo || !estado) return;

  await supabase.schema("eoro").from("antecedentes").insert({
    persona_id,
    tipo,
    estado,
    descripcion,
    entidad_reporta,
    fecha_sancion,
    fecha_vencimiento,
    fuente: "manual",
  });

  revalidatePath("/admin/antecedentes");
}

export async function deleteAntecedente(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("antecedentes").delete().eq("id", id);
  revalidatePath("/admin/antecedentes");
}

// ============================================================
// VINCULOS FAMILIARES
// ============================================================

export async function createVinculo(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_a_id = formData.get("persona_a_id") as string;
  const persona_b_id = formData.get("persona_b_id") as string;
  const parentesco = formData.get("parentesco") as string;
  const verificado = formData.get("verificado") === "true";

  if (!persona_a_id || !persona_b_id || !parentesco) return;

  await supabase.schema("eoro").from("vinculos_familiares").insert({
    persona_a_id,
    persona_b_id,
    parentesco,
    verificado,
    fuente: "manual",
    fecha_deteccion: new Date().toISOString(),
  });

  revalidatePath("/admin/vinculos");
}

export async function deleteVinculo(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("vinculos_familiares").delete().eq("id", id);
  revalidatePath("/admin/vinculos");
}

// ============================================================
// FINANCIACION CAMPANA
// ============================================================

export async function createFinanciacion(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const candidatura_id = formData.get("candidatura_id") as string;
  const tipo = formData.get("tipo") as string;
  const concepto = formData.get("concepto") as string;
  const valor = Number(formData.get("valor")) || 0;
  const aportante_nombre = formData.get("aportante_nombre") as string;
  const aportante_tipo = formData.get("aportante_tipo") as string;

  if (!candidatura_id || !tipo || !concepto) return;

  await supabase.schema("eoro").from("financiacion_campana").insert({
    candidatura_id,
    tipo,
    concepto,
    valor,
    aportante_nombre,
    aportante_tipo,
    fuente: "manual",
  });

  revalidatePath("/admin/financiacion");
}

export async function deleteFinanciacion(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("financiacion_campana").delete().eq("id", id);
  revalidatePath("/admin/financiacion");
}
