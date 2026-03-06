// Graph node/edge type constants — UI labels, safe for client components

export const NODO_TIPOS = ["candidato", "familiar", "cargo", "contratista", "partido"] as const;
export type NodoTipo = (typeof NODO_TIPOS)[number];

export const NODO_TIPO_LABELS: Record<NodoTipo, string> = {
  candidato: "Candidatos",
  familiar: "Familiares",
  cargo: "Cargos",
  contratista: "Contratistas",
  partido: "Partidos",
};

export const EDGE_TIPO_LABELS: Record<string, string> = {
  familiar: "Vinculo familiar",
  cargo: "Cargo publico",
  contrato: "Contrato",
  partido: "Afiliacion",
  financiador: "Financiacion",
};
