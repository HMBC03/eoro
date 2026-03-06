import type { GrafoNodo, GrafoEdge, GrafoData } from "@/lib/types";
import { colors } from "@/styles/colors";

// ============================================================
// Graph data — ~35 nodes, ~55 edges
// Clusters: Ramirez dynasty (Cordoba), Lopez network (Bolivar),
//           clean candidates, party hubs
// ============================================================

const nodos: GrafoNodo[] = [
  // --- Candidatos ---
  { id: "c14", label: "Humberto Ramirez", tipo: "candidato", color: "#0033A0", metadata: { partido: "Partido Conservador", departamento: "Cordoba", cargo_actual: "Senador", alertas: 2 } },
  { id: "c10", label: "Andres Lopez", tipo: "candidato", color: "#CC0000", metadata: { partido: "Partido Liberal", departamento: "Bolivar", cargo_actual: "Senador", alertas: 1 } },
  { id: "c01", label: "Mariana Velasco", tipo: "candidato", color: "#FFD700", metadata: { partido: "Pacto Historico", departamento: "Antioquia", cargo_actual: "Candidata presidencial", alertas: 0 } },
  { id: "c07", label: "Diana Ospina", tipo: "candidato", color: "#8B5CF6", metadata: { partido: "Nueva Colombia", departamento: "Risaralda", cargo_actual: "Candidata Camara", alertas: 0 } },
  { id: "c09", label: "Valentina Rojas", tipo: "candidato", color: "#00843D", metadata: { partido: "Alianza Verde", departamento: "Caldas", cargo_actual: "Candidata Senado", alertas: 0 } },
  { id: "c02", label: "Ricardo Castaño", tipo: "candidato", color: "#003DA5", metadata: { partido: "Centro Democratico", departamento: "Bogota D.C.", cargo_actual: "Candidato presidencial", alertas: 0 } },
  { id: "c04", label: "Carlos Pinzon", tipo: "candidato", color: "#003DA5", metadata: { partido: "Centro Democratico", departamento: "Santander", cargo_actual: "Candidato Senado", alertas: 0 } },
  { id: "c06", label: "Felipe Gutierrez", tipo: "candidato", color: "#00A550", metadata: { partido: "Cambio Radical", departamento: "Cundinamarca", cargo_actual: "Senador", alertas: 0 } },
  { id: "c08", label: "Jorge Duarte", tipo: "candidato", color: "#FF6600", metadata: { partido: "Partido de la U", departamento: "Norte de Santander", cargo_actual: "Candidato Senado", alertas: 0 } },
  { id: "c16", label: "Oscar Bermudez", tipo: "candidato", color: "#00A550", metadata: { partido: "Cambio Radical", departamento: "Meta", cargo_actual: "Candidato Senado", alertas: 0 } },

  // --- Familiares ---
  { id: "fam01", label: "Eduardo Ramirez", tipo: "familiar", color: colors.nodos.familiar, metadata: { parentesco: "Hermano de c14", departamento: "Cordoba", cargo: "Exgobernador de Cordoba" } },
  { id: "fam02", label: "Sebastian Ramirez", tipo: "familiar", color: colors.nodos.familiar, metadata: { parentesco: "Hijo de c14", departamento: "Cordoba", cargo: "Alcalde de Monteria" } },
  { id: "fam03", label: "Luis F. Ochoa", tipo: "familiar", color: colors.nodos.familiar, metadata: { parentesco: "Cuñado de c14", departamento: "Cordoba", cargo: "Contratista" } },
  { id: "fam04", label: "Andres Torres", tipo: "familiar", color: colors.nodos.familiar, metadata: { parentesco: "Esposo de c01", departamento: "Antioquia", cargo: "Abogado" } },
  { id: "fam05", label: "Jairo Lopez", tipo: "familiar", color: colors.nodos.familiar, metadata: { parentesco: "Primo de c10", departamento: "Bolivar", cargo: "Contratista" } },

  // --- Cargos publicos ---
  { id: "cargo01", label: "Gobernacion Cordoba", tipo: "cargo", color: colors.nodos.cargo, metadata: { entidad: "Gobernacion de Cordoba", nivel: "departamental", departamento: "Cordoba" } },
  { id: "cargo02", label: "Alcaldia Monteria", tipo: "cargo", color: colors.nodos.cargo, metadata: { entidad: "Alcaldia de Monteria", nivel: "municipal", departamento: "Cordoba" } },
  { id: "cargo03", label: "Senado", tipo: "cargo", color: colors.nodos.cargo, metadata: { entidad: "Senado de la Republica", nivel: "nacional", departamento: "Bogota D.C." } },
  { id: "cargo04", label: "Alcaldia Cartagena", tipo: "cargo", color: colors.nodos.cargo, metadata: { entidad: "Alcaldia de Cartagena", nivel: "municipal", departamento: "Bolivar" } },
  { id: "cargo05", label: "Min. Defensa", tipo: "cargo", color: colors.nodos.cargo, metadata: { entidad: "Ministerio de Defensa", nivel: "nacional", departamento: "Bogota D.C." } },
  { id: "cargo06", label: "Min. Hacienda", tipo: "cargo", color: colors.nodos.cargo, metadata: { entidad: "Ministerio de Hacienda", nivel: "nacional", departamento: "Bogota D.C." } },

  // --- Contratistas (entidades que reciben contratos) ---
  { id: "emp01", label: "Construcordoba SAS", tipo: "contratista", color: colors.nodos.contratista, metadata: { nit: "900123456-1", departamento: "Cordoba", contratos: 3, valor_total: "$18.500M" } },
  { id: "emp02", label: "Inversiones Ochoa", tipo: "contratista", color: colors.nodos.contratista, metadata: { nit: "900234567-2", departamento: "Cordoba", contratos: 2, valor_total: "$12.800M" } },
  { id: "emp03", label: "Caribe Obras SAS", tipo: "contratista", color: colors.nodos.contratista, metadata: { nit: "900345678-3", departamento: "Bolivar", contratos: 2, valor_total: "$45.000M" } },
  { id: "emp04", label: "Infraestructura BQ", tipo: "contratista", color: colors.nodos.contratista, metadata: { nit: "900456789-4", departamento: "Bolivar", contratos: 1, valor_total: "$8.200M" } },
  { id: "emp05", label: "TechGov Colombia", tipo: "contratista", color: colors.nodos.contratista, metadata: { nit: "900567890-5", departamento: "Bogota D.C.", contratos: 1, valor_total: "$2.300M" } },

  // --- Partidos (hubs) ---
  { id: "p_pc", label: "P. Conservador", tipo: "partido", color: "#0033A0", metadata: { sigla: "PC", ideologia: "Centro-derecha", candidatos_vinculados: 1 } },
  { id: "p_pl", label: "P. Liberal", tipo: "partido", color: "#CC0000", metadata: { sigla: "PL", ideologia: "Centro-izquierda", candidatos_vinculados: 1 } },
  { id: "p_ph", label: "Pacto Historico", tipo: "partido", color: "#FFD700", metadata: { sigla: "PH", ideologia: "Izquierda progresista", candidatos_vinculados: 1 } },
  { id: "p_cd", label: "Centro Democratico", tipo: "partido", color: "#003DA5", metadata: { sigla: "CD", ideologia: "Derecha conservadora", candidatos_vinculados: 2 } },
  { id: "p_av", label: "Alianza Verde", tipo: "partido", color: "#00843D", metadata: { sigla: "AV", ideologia: "Centro-izquierda verde", candidatos_vinculados: 1 } },
  { id: "p_nc", label: "Nueva Colombia", tipo: "partido", color: "#8B5CF6", metadata: { sigla: "NC", ideologia: "Centro independiente", candidatos_vinculados: 1 } },
  { id: "p_cr", label: "Cambio Radical", tipo: "partido", color: "#00A550", metadata: { sigla: "CR", ideologia: "Centro", candidatos_vinculados: 2 } },
  { id: "p_pu", label: "Partido de la U", tipo: "partido", color: "#FF6600", metadata: { sigla: "U", ideologia: "Centro", candidatos_vinculados: 1 } },
];

const edges: GrafoEdge[] = [
  // === CLUSTER RAMIREZ (Cordoba) — dynasty nepotism ===
  // Family ties
  { source: "c14", target: "fam01", tipo: "familiar", label: "Hermano", peso: 3 },
  { source: "c14", target: "fam02", tipo: "familiar", label: "Hijo", peso: 3 },
  { source: "c14", target: "fam03", tipo: "familiar", label: "Cuñado", peso: 2 },
  { source: "fam01", target: "fam03", tipo: "familiar", label: "Cuñados", peso: 1 },
  // Family → Cargos
  { source: "fam01", target: "cargo01", tipo: "cargo", label: "Gobernador 2020-2023", peso: 2 },
  { source: "fam02", target: "cargo02", tipo: "cargo", label: "Alcalde 2024-2027", peso: 2 },
  { source: "c14", target: "cargo03", tipo: "cargo", label: "Senador 2010-2022", peso: 2 },
  // Contratista links
  { source: "fam03", target: "emp01", tipo: "contrato", label: "Representante legal", peso: 3 },
  { source: "fam03", target: "emp02", tipo: "contrato", label: "Socio fundador", peso: 3 },
  { source: "emp01", target: "cargo01", tipo: "contrato", label: "3 contratos $18.500M", peso: 3 },
  { source: "emp02", target: "cargo01", tipo: "contrato", label: "2 contratos $12.800M", peso: 2 },
  { source: "emp02", target: "cargo02", tipo: "contrato", label: "1 contrato $4.200M", peso: 2 },
  // Party
  { source: "c14", target: "p_pc", tipo: "partido", label: "Senador por PC", peso: 1 },

  // === CLUSTER LOPEZ (Bolivar) — contract concentration ===
  { source: "c10", target: "fam05", tipo: "familiar", label: "Primo", peso: 2 },
  { source: "c10", target: "cargo04", tipo: "cargo", label: "Alcalde 2016-2019", peso: 2 },
  { source: "c10", target: "cargo03", tipo: "cargo", label: "Senador 2022-", peso: 2 },
  { source: "fam05", target: "emp03", tipo: "contrato", label: "Representante legal", peso: 3 },
  { source: "fam05", target: "emp04", tipo: "contrato", label: "Socio", peso: 2 },
  { source: "emp03", target: "cargo04", tipo: "contrato", label: "Via perimetral $45.000M", peso: 3 },
  { source: "emp04", target: "cargo04", tipo: "contrato", label: "1 contrato $8.200M", peso: 2 },
  { source: "c10", target: "p_pl", tipo: "partido", label: "Senador por PL", peso: 1 },

  // === CLEAN CANDIDATES ===
  // c01 — Velasco
  { source: "c01", target: "fam04", tipo: "familiar", label: "Esposo", peso: 1 },
  { source: "c01", target: "cargo03", tipo: "cargo", label: "Senadora 2014-2022", peso: 2 },
  { source: "c01", target: "p_ph", tipo: "partido", label: "Candidata PH", peso: 1 },

  // c07 — Ospina
  { source: "c07", target: "p_nc", tipo: "partido", label: "Candidata NC", peso: 1 },
  { source: "c07", target: "emp05", tipo: "contrato", label: "Fundadora", peso: 1 },

  // c09 — Rojas
  { source: "c09", target: "p_av", tipo: "partido", label: "Candidata AV", peso: 1 },

  // c02 — Castaño
  { source: "c02", target: "cargo06", tipo: "cargo", label: "Ministro 2018-2020", peso: 2 },
  { source: "c02", target: "p_cd", tipo: "partido", label: "Candidato CD", peso: 1 },

  // c04 — Pinzon
  { source: "c04", target: "cargo05", tipo: "cargo", label: "Min. Defensa 2011-2013", peso: 2 },
  { source: "c04", target: "p_cd", tipo: "partido", label: "Candidato CD", peso: 1 },

  // c06 — Gutierrez
  { source: "c06", target: "cargo03", tipo: "cargo", label: "Senador 2018-2026", peso: 2 },
  { source: "c06", target: "p_cr", tipo: "partido", label: "Senador CR", peso: 1 },

  // c08 — Duarte
  { source: "c08", target: "p_pu", tipo: "partido", label: "Candidato U", peso: 1 },

  // c16 — Bermudez
  { source: "c16", target: "p_cr", tipo: "partido", label: "Candidato CR", peso: 1 },
  { source: "c16", target: "cargo03", tipo: "cargo", label: "Senador 2014-2022", peso: 2 },

  // === Cross-cluster connections ===
  // Ramirez changed party PC → PU in 2018 (back to PC in 2026)
  { source: "c14", target: "p_pu", tipo: "partido", label: "Senador por U 2018-2022", peso: 1 },

  // Financiador shared
  { source: "emp05", target: "cargo03", tipo: "contrato", label: "Contrato TIC Senado $2.300M", peso: 1 },
];

export const grafoDatos: GrafoData = { nodos, edges };

// Helper: get node by id
export function getNodoById(id: string): GrafoNodo | undefined {
  return nodos.find((n) => n.id === id);
}

// Helper: get edges for a node
export function getEdgesForNode(nodeId: string): GrafoEdge[] {
  return edges.filter((e) => e.source === nodeId || e.target === nodeId);
}

// Helper: get connected nodes for a node
export function getConnectedNodes(nodeId: string): GrafoNodo[] {
  const edgesForNode = getEdgesForNode(nodeId);
  const connectedIds = new Set<string>();
  for (const e of edgesForNode) {
    if (e.source === nodeId) connectedIds.add(e.target);
    else connectedIds.add(e.source);
  }
  return nodos.filter((n) => connectedIds.has(n.id));
}

// Types for node types
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
