"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./_lib/require-admin";

// ============================================================
// GRAFO NODOS
// ============================================================

export async function createGrafoNodo(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const label = formData.get("label") as string;
  const tipo = formData.get("tipo") as string;
  const color = formData.get("color") as string;
  const foto_url = (formData.get("foto_url") as string) || null;

  if (!label || !tipo) return;

  await supabase.schema("eoro").from("grafo_nodos").insert({
    label,
    tipo,
    color,
    foto_url,
    metadata: {},
  });

  revalidatePath("/admin/grafo-nodos");
}

export async function updateGrafoNodo(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("grafo_nodos").update({
    label: formData.get("label") as string,
    tipo: formData.get("tipo") as string,
    color: formData.get("color") as string,
    foto_url: (formData.get("foto_url") as string) || null,
  }).eq("id", id);
  revalidatePath("/admin/grafo-nodos");
}

export async function deleteGrafoNodo(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("grafo_nodos").delete().eq("id", id);
  revalidatePath("/admin/grafo-nodos");
}

// ============================================================
// GRAFO EDGES
// ============================================================

export async function createGrafoEdge(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const source_id = formData.get("source_id") as string;
  const target_id = formData.get("target_id") as string;
  const tipo = formData.get("tipo") as string;
  const label = formData.get("label") as string;
  const peso = Number(formData.get("peso")) || 1;

  if (!source_id || !target_id || !tipo) return;

  await supabase.schema("eoro").from("grafo_edges").insert({
    source_id,
    target_id,
    tipo,
    label,
    peso,
  });

  revalidatePath("/admin/grafo-edges");
}

export async function updateGrafoEdge(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("grafo_edges").update({
    source_id: formData.get("source_id") as string,
    target_id: formData.get("target_id") as string,
    tipo: formData.get("tipo") as string,
    label: formData.get("label") as string,
    peso: Number(formData.get("peso")) || 1,
  }).eq("id", id);
  revalidatePath("/admin/grafo-edges");
}

export async function deleteGrafoEdge(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("grafo_edges").delete().eq("id", id);
  revalidatePath("/admin/grafo-edges");
}

// ============================================================
// DYNASTY NODES
// ============================================================

export async function createDynastyNode(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const candidato_id = (formData.get("candidato_id") as string) || null;
  const nombre = formData.get("nombre") as string;
  const rol = formData.get("rol") as string;
  const generation = Number(formData.get("generation")) || 0;
  const tipo = formData.get("tipo") as string;
  const color = formData.get("color") as string;

  if (!nombre || !rol || !tipo) return;

  await supabase.schema("eoro").from("dynasty_nodes").insert({
    candidato_id,
    nombre,
    rol,
    generation,
    tipo,
    color,
  });

  revalidatePath("/admin/dynasty-nodos");
}

export async function updateDynastyNode(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("dynasty_nodes").update({
    candidato_id: (formData.get("candidato_id") as string) || null,
    nombre: formData.get("nombre") as string,
    rol: formData.get("rol") as string,
    generation: Number(formData.get("generation")) || 0,
    tipo: formData.get("tipo") as string,
    color: formData.get("color") as string,
  }).eq("id", id);
  revalidatePath("/admin/dynasty-nodos");
}

export async function deleteDynastyNode(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("dynasty_nodes").delete().eq("id", id);
  revalidatePath("/admin/dynasty-nodos");
}

// ============================================================
// DYNASTY EDGES
// ============================================================

export async function createDynastyEdge(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const source_id = formData.get("source_id") as string;
  const target_id = formData.get("target_id") as string;
  const label = formData.get("label") as string;

  if (!source_id || !target_id) return;

  await supabase.schema("eoro").from("dynasty_edges").insert({
    source_id,
    target_id,
    label,
  });

  revalidatePath("/admin/dynasty-edges");
}

export async function updateDynastyEdge(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("dynasty_edges").update({
    source_id: formData.get("source_id") as string,
    target_id: formData.get("target_id") as string,
    label: formData.get("label") as string,
  }).eq("id", id);
  revalidatePath("/admin/dynasty-edges");
}

export async function deleteDynastyEdge(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("dynasty_edges").delete().eq("id", id);
  revalidatePath("/admin/dynasty-edges");
}

// ============================================================
// FAMILY NITS
// ============================================================

export async function createFamilyNit(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const nit = formData.get("nit") as string;

  if (!nit) return;

  await supabase.schema("eoro").from("family_nits").insert({
    nit,
  });

  revalidatePath("/admin/family-nits");
}

export async function updateFamilyNit(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("family_nits").update({
    nit: formData.get("nit") as string,
  }).eq("id", id);
  revalidatePath("/admin/family-nits");
}

export async function deleteFamilyNit(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.schema("eoro").from("family_nits").delete().eq("id", id);
  revalidatePath("/admin/family-nits");
}
