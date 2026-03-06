"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./_lib/require-admin";

// ============================================================
// PERSONAS
// ============================================================

export async function createPersona(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const nombre = formData.get("nombre_completo") as string;
  const cedula = formData.get("cedula") as string;
  const tipo = formData.get("tipo") as string;
  const departamento = formData.get("departamento_origen") as string;
  const biografia = (formData.get("biografia") as string) || "";

  if (!nombre || !cedula || !tipo) return;

  await supabase.schema("eoro").from("personas").insert({
    nombre_completo: nombre,
    cedula,
    tipo,
    departamento_origen: departamento || "Colombia",
    biografia,
    fecha_nacimiento: "1990-01-01",
    foto_url: null,
    redes_sociales: {},
  });

  revalidatePath("/admin/personas");
}

export async function updatePersona(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const nombre = formData.get("nombre_completo") as string;
  const cedula = formData.get("cedula") as string;
  const tipo = formData.get("tipo") as string;
  const departamento = formData.get("departamento_origen") as string;
  const biografia = (formData.get("biografia") as string) || "";

  await supabase
    .schema("eoro")
    .from("personas")
    .update({
      nombre_completo: nombre,
      cedula,
      tipo,
      departamento_origen: departamento,
      biografia,
    })
    .eq("id", id);

  revalidatePath("/admin/personas");
}

export async function deletePersona(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("personas").delete().eq("id", id);
  revalidatePath("/admin/personas");
}

// ============================================================
// CONTRATOS
// ============================================================

export async function updateContrato(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const estado = formData.get("estado") as string;
  const objeto = formData.get("objeto") as string;

  const updates: Record<string, string> = {};
  if (estado) updates.estado = estado;
  if (objeto) updates.objeto = objeto;

  await supabase
    .schema("eoro")
    .from("contratos")
    .update(updates)
    .eq("id", id);

  revalidatePath("/admin/contratos");
}

export async function deleteContrato(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("contratos").delete().eq("id", id);
  revalidatePath("/admin/contratos");
}

// ============================================================
// ALERTAS
// ============================================================

export async function toggleAlertaVerificada(id: string, verificada: boolean): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .schema("eoro")
    .from("alertas")
    .update({ verificada })
    .eq("id", id);

  revalidatePath("/admin/alertas");
}

export async function deleteAlerta(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("alertas").delete().eq("id", id);
  revalidatePath("/admin/alertas");
}

// ============================================================
// MODULE CONFIG
// ============================================================

export async function toggleModuleVisibility(moduleKey: string, visible: boolean): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .schema("eoro")
    .from("module_config")
    .update({ visible, updated_at: new Date().toISOString() })
    .eq("module_key", moduleKey);

  revalidatePath("/admin/modulos");
  revalidatePath("/");
}
