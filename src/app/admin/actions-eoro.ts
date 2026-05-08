"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./_lib/require-admin";
import { recalculateEoroScore } from "@/lib/data/eoro-score";

// ============================================================
// EORO EVALUACIONES
// ============================================================

export async function createEvaluacion(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_id = formData.get("persona_id") as string;
  const variable_id = formData.get("variable_id") as string;
  const puntos_restados = Number(formData.get("puntos_restados")) || 0;
  const evidencia_url = (formData.get("evidencia_url") as string) || "";
  const fuente_descripcion =
    (formData.get("fuente_descripcion") as string) || "";
  const fecha_deteccion =
    (formData.get("fecha_deteccion") as string) ||
    new Date().toISOString().slice(0, 10);
  const notas = (formData.get("notas") as string) || "";

  if (!persona_id || !variable_id) return;

  await supabase.schema("eoro").from("eoro_evaluaciones").insert({
    persona_id,
    variable_id,
    puntos_restados,
    evidencia_url,
    fuente_descripcion,
    fecha_deteccion,
    notas,
  });

  await recalculateEoroScore(persona_id);

  revalidatePath("/admin/eoro-evaluaciones");
  revalidatePath(`/presidenciales/${persona_id}`);
}

export async function updateEvaluacion(
  id: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const persona_id = formData.get("persona_id") as string;

  await supabase
    .schema("eoro")
    .from("eoro_evaluaciones")
    .update({
      variable_id: formData.get("variable_id") as string,
      puntos_restados: Number(formData.get("puntos_restados")) || 0,
      evidencia_url: (formData.get("evidencia_url") as string) || "",
      fuente_descripcion:
        (formData.get("fuente_descripcion") as string) || "",
      fecha_deteccion: formData.get("fecha_deteccion") as string,
      fecha_resolucion:
        (formData.get("fecha_resolucion") as string) || null,
      resolucion_tipo:
        (formData.get("resolucion_tipo") as string) || null,
      notas: (formData.get("notas") as string) || "",
    })
    .eq("id", id);

  if (persona_id) await recalculateEoroScore(persona_id);

  revalidatePath("/admin/eoro-evaluaciones");
  revalidatePath(`/presidenciales/${persona_id}`);
}

export async function deleteEvaluacion(
  id: string,
  personaId: string
): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .schema("eoro")
    .from("eoro_evaluaciones")
    .delete()
    .eq("id", id);
  await recalculateEoroScore(personaId);
  revalidatePath("/admin/eoro-evaluaciones");
}

// ============================================================
// EORO REPORTES CIUDADANOS
// ============================================================

export async function updateReporteEstado(
  id: string,
  personaId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await requireAdmin();

  const estado = formData.get("estado") as string;
  const impacto_score = Number(formData.get("impacto_score")) || 0;
  const notas_internas = (formData.get("notas_internas") as string) || "";

  const updateData: Record<string, unknown> = {
    estado,
    impacto_score,
    notas_internas,
  };

  if (estado === "verificado" || estado === "rechazado") {
    updateData.verificado_por = user.email;
    updateData.verificado_at = new Date().toISOString();
  }

  await supabase
    .schema("eoro")
    .from("eoro_reportes_ciudadanos")
    .update(updateData)
    .eq("id", id);

  if (estado === "verificado" || estado === "rechazado") {
    await recalculateEoroScore(personaId);
  }

  revalidatePath("/admin/eoro-reportes");
}

export async function deleteReporte(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .schema("eoro")
    .from("eoro_reportes_ciudadanos")
    .delete()
    .eq("id", id);
  revalidatePath("/admin/eoro-reportes");
}

// ============================================================
// EORO VARIABLES
// ============================================================

export async function updateVariable(
  id: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .schema("eoro")
    .from("eoro_variables")
    .update({
      nombre: formData.get("nombre") as string,
      penalizacion: Number(formData.get("penalizacion")) || 0,
      condicion: (formData.get("condicion") as string) || "",
      activa: formData.get("activa") === "true",
    })
    .eq("id", id);
  revalidatePath("/admin/eoro-variables");
}

// ============================================================
// RECALCULATE ALL
// ============================================================

export async function recalculateAllScores(): Promise<void> {
  const { supabase } = await requireAdmin();

  const { data: personas } = await supabase
    .schema("eoro")
    .from("personas")
    .select("id");

  for (const p of personas ?? []) {
    await recalculateEoroScore(p.id);
  }

  revalidatePath("/admin/eoro-evaluaciones");
  revalidatePath("/presidenciales");
}
