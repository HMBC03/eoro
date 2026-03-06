import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Alerta } from "@/lib/types";

export async function getAlertas(): Promise<Alerta[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("alertas")
    .select("*")
    .order("detectada_at", { ascending: false });

  return (data ?? []).map((a) => ({
    ...a,
    datos_soporte: a.datos_soporte ?? {},
  }));
}

export async function getAlertasByPersona(personaId: string): Promise<Alerta[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("alertas")
    .select("*")
    .eq("persona_id", personaId)
    .order("detectada_at", { ascending: false });

  return (data ?? []).map((a) => ({
    ...a,
    datos_soporte: a.datos_soporte ?? {},
  }));
}
