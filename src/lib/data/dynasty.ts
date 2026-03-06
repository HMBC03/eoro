import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { DynastyNode, DynastyEdge, DynastyData } from "@/lib/types";

export type { DynastyNode, DynastyEdge, DynastyData };

function mapNode(n: Record<string, unknown>): DynastyNode {
  return {
    id: n.id as string,
    label: n.nombre as string,
    role: n.rol as string,
    generation: n.generation as number,
    isMainCandidate: n.tipo === "main",
    color: n.color as string,
  };
}

function mapEdge(e: Record<string, unknown>): DynastyEdge {
  return {
    id: e.id as string,
    source: e.source_id as string,
    target: e.target_id as string,
    relation: e.label as string,
  };
}

export async function getDynastyData(): Promise<DynastyData> {
  const supabase = await createClient();

  const [nodesRes, edgesRes] = await Promise.all([
    supabase.schema("eoro").from("dynasty_nodes").select("*"),
    supabase.schema("eoro").from("dynasty_edges").select("*"),
  ]);

  return {
    nodes: (nodesRes.data ?? []).map(mapNode),
    edges: (edgesRes.data ?? []).map(mapEdge),
  };
}

export async function getDynastyDataForCandidato(candidatoId: string): Promise<DynastyData | null> {
  const supabase = await createClient();

  const { data: mainNode } = await supabase
    .schema("eoro")
    .from("dynasty_nodes")
    .select("*")
    .eq("candidato_id", candidatoId)
    .maybeSingle();

  if (!mainNode) return null;

  const [nodesRes, edgesRes] = await Promise.all([
    supabase.schema("eoro").from("dynasty_nodes").select("*"),
    supabase.schema("eoro").from("dynasty_edges").select("*"),
  ]);

  return {
    nodes: (nodesRes.data ?? []).map(mapNode),
    edges: (edgesRes.data ?? []).map(mapEdge),
  };
}
