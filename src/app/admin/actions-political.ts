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

export async function deleteCargo(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("cargos_publicos").delete().eq("id", id);
  revalidatePath("/admin/cargos");
}
