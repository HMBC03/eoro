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
  const departamento = formData.get("departamento_origen") as string;
  const biografia = (formData.get("biografia") as string) || "";

  if (!nombre || !cedula) return;

  await supabase.schema("eoro").from("personas").insert({
    nombre_completo: nombre,
    cedula,
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
  const departamento = formData.get("departamento_origen") as string;
  const biografia = (formData.get("biografia") as string) || "";

  await supabase
    .schema("eoro")
    .from("personas")
    .update({
      nombre_completo: nombre,
      cedula,
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

  await supabase
    .schema("eoro")
    .from("contratos")
    .update({
      entidad_nombre: formData.get("entidad_nombre") as string,
      contratista_nombre: formData.get("contratista_nombre") as string,
      objeto: formData.get("objeto") as string,
      valor_contrato: Number(formData.get("valor_contrato")) || 0,
      estado: formData.get("estado") as string,
      departamento: formData.get("departamento") as string,
      fecha_firma: formData.get("fecha_firma") as string,
    })
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

export async function updateAlerta(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("alertas").update({
    tipo: formData.get("tipo") as string,
    severidad: formData.get("severidad") as string,
    descripcion: formData.get("descripcion") as string,
    verificada: formData.get("verificada") === "true",
  }).eq("id", id);
  revalidatePath("/admin/alertas");
}

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
