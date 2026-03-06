import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { GrafoNodo, GrafoEdge, GrafoData } from "@/lib/types";

export async function getGrafoData(): Promise<GrafoData> {
  const supabase = await createClient();

  const [nodosRes, edgesRes] = await Promise.all([
    supabase.schema("eoro").from("grafo_nodos").select("*"),
    supabase.schema("eoro").from("grafo_edges").select("*"),
  ]);

  const nodos: GrafoNodo[] = (nodosRes.data ?? []).map((n) => ({
    id: n.id,
    label: n.label,
    tipo: n.tipo,
    color: n.color,
    foto_url: n.foto_url ?? undefined,
    metadata: n.metadata ?? {},
  }));

  const edges: GrafoEdge[] = (edgesRes.data ?? []).map((e) => ({
    source: e.source_id,
    target: e.target_id,
    tipo: e.tipo,
    label: e.label,
    peso: e.peso,
  }));

  return { nodos, edges };
}
