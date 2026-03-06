"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./_lib/require-admin";

// ============================================================
// PARTIDOS
// ============================================================

export async function createPartido(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const nombre = formData.get("nombre") as string;
  const sigla = formData.get("sigla") as string;
  const color_hex = formData.get("color_hex") as string;
  const ideologia = formData.get("ideologia") as string;
  const personeria_juridica = formData.get("personeria_juridica") === "true";

  if (!nombre || !sigla) return;

  await supabase.schema("eoro").from("partidos").insert({
    nombre,
    sigla,
    color_hex,
    ideologia,
    personeria_juridica,
    activo: true,
    logo_url: null,
  });

  revalidatePath("/admin/partidos");
}

export async function updatePartido(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("partidos").update({
    nombre: formData.get("nombre") as string,
    sigla: formData.get("sigla") as string,
    color_hex: formData.get("color_hex") as string,
    ideologia: formData.get("ideologia") as string,
    personeria_juridica: formData.get("personeria_juridica") === "true",
    activo: formData.get("activo") === "true",
  }).eq("id", id);
  revalidatePath("/admin/partidos");
}

export async function deletePartido(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("partidos").delete().eq("id", id);
  revalidatePath("/admin/partidos");
}

// ============================================================
// CANDIDATURAS
// ============================================================

export async function createCandidatura(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_id = formData.get("persona_id") as string;
  const partido_id = formData.get("partido_id") as string;
  const tipo = formData.get("tipo") as string;
  const eleccion_year = Number(formData.get("eleccion_year")) || 0;
  const circunscripcion = formData.get("circunscripcion") as string;
  const estado = formData.get("estado") as string;
  const elegido = formData.get("elegido") === "on";
  const votos_obtenidos = Number(formData.get("votos_obtenidos")) || 0;

  if (!persona_id || !partido_id || !tipo) return;

  await supabase.schema("eoro").from("candidaturas").insert({
    persona_id,
    partido_id,
    tipo,
    eleccion_year,
    circunscripcion,
    estado,
    elegido,
    votos_obtenidos,
    fuente: "manual",
  });

  revalidatePath("/admin/candidaturas");
}

export async function updateCandidatura(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("candidaturas").update({
    persona_id: formData.get("persona_id") as string,
    partido_id: formData.get("partido_id") as string,
    tipo: formData.get("tipo") as string,
    eleccion_year: Number(formData.get("eleccion_year")) || 0,
    circunscripcion: formData.get("circunscripcion") as string,
    estado: formData.get("estado") as string,
    elegido: formData.get("elegido") === "true",
    votos_obtenidos: Number(formData.get("votos_obtenidos")) || 0,
  }).eq("id", id);
  revalidatePath("/admin/candidaturas");
}

export async function deleteCandidatura(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("candidaturas").delete().eq("id", id);
  revalidatePath("/admin/candidaturas");
}

// ============================================================
// CARGOS PUBLICOS
// ============================================================

export async function createCargo(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_id = formData.get("persona_id") as string;
  const cargo = formData.get("cargo") as string;
  const entidad = formData.get("entidad") as string;
  const departamento = formData.get("departamento") as string;
  const municipio = formData.get("municipio") as string;
  const fecha_inicio = formData.get("fecha_inicio") as string;
  const fecha_fin = (formData.get("fecha_fin") as string) || null;
  const nivel = formData.get("nivel") as string;
  const partido_id = (formData.get("partido_id") as string) || null;

  if (!persona_id || !cargo || !entidad) return;

  await supabase.schema("eoro").from("cargos_publicos").insert({
    persona_id,
    cargo,
    entidad,
    departamento,
    municipio,
    fecha_inicio,
    fecha_fin,
    nivel,
    partido_id,
    fuente: "manual",
  });

  revalidatePath("/admin/cargos");
}

export async function updateCargo(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("cargos_publicos").update({
    persona_id: formData.get("persona_id") as string,
    cargo: formData.get("cargo") as string,
    entidad: formData.get("entidad") as string,
    departamento: formData.get("departamento") as string,
    municipio: formData.get("municipio") as string,
    fecha_inicio: formData.get("fecha_inicio") as string,
    fecha_fin: (formData.get("fecha_fin") as string) || null,
    nivel: formData.get("nivel") as string,
  }).eq("id", id);
  revalidatePath("/admin/cargos");
}

export async function deleteCargo(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("cargos_publicos").delete().eq("id", id);
  revalidatePath("/admin/cargos");
}
