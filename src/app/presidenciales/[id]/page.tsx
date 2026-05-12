import { notFound } from "next/navigation";
import { getPresidencialById } from "@/lib/data/presidenciales";
import { getHistorialForPersona, getEvaluacionesForPersona } from "@/lib/data/eoro-score";
import { createClient } from "@/lib/supabase/server";
import PresidencialDetailClient from "./PresidencialDetailClient";

export default async function PresidencialPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presidencial = await getPresidencialById(id);
  if (!presidencial) notFound();

  const [eoroHistorial, eoroEvaluaciones] = await Promise.all([
    getHistorialForPersona(id),
    getEvaluacionesForPersona(id),
  ]);

  const familiarIds = presidencial.vinculos.map((v) =>
    v.persona_a_id === id ? v.persona_b_id : v.persona_a_id
  );

  const familiarMap: Record<string, { id: string; nombre_completo: string; tipo: string; biografia: string }> = {};
  if (familiarIds.length > 0) {
    const supabase = await createClient();
    const { data: familiares } = await supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo, biografia")
      .in("id", familiarIds);
    for (const f of familiares ?? []) {
      familiarMap[f.id] = { ...f, tipo: "" };
    }
  }

  return (
    <PresidencialDetailClient
      presidencial={presidencial}
      dynastyData={null}
      familiarMap={familiarMap}
      eoroHistorial={eoroHistorial}
      eoroEvaluaciones={eoroEvaluaciones}
    />
  );
}
