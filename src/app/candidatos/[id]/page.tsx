import { notFound } from "next/navigation";
import { getCandidatoById } from "@/lib/data/candidatos";
import { getDynastyDataForCandidato } from "@/lib/data/dynasty";
import { getHistorialForPersona, getEvaluacionesForPersona } from "@/lib/data/eoro-score";
import { createClient } from "@/lib/supabase/server";
import CandidatoDetailClient from "./CandidatoDetailClient";

export default async function CandidatoPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidato = await getCandidatoById(id);
  if (!candidato) notFound();

  const [dynastyData, eoroHistorial, eoroEvaluaciones] = await Promise.all([
    getDynastyDataForCandidato(id),
    getHistorialForPersona(id),
    getEvaluacionesForPersona(id),
  ]);

  // Fetch familiar personas for vinculos section
  const familiarIds = candidato.vinculos.map((v) =>
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
    <CandidatoDetailClient
      candidato={candidato}
      dynastyData={dynastyData}
      familiarMap={familiarMap}
      eoroHistorial={eoroHistorial}
      eoroEvaluaciones={eoroEvaluaciones}
    />
  );
}
