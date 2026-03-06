"use client";

import { NODO_TIPO_LABELS, EDGE_TIPO_LABELS } from "@/lib/constants/grafo";
import type { NodoTipo } from "@/lib/constants/grafo";
import type { GrafoNodo, GrafoEdge } from "@/lib/types";

interface GraphDetailPanelProps {
  selectedNodeId: string | null;
  onClose: () => void;
  nodos: GrafoNodo[];
  edges: GrafoEdge[];
}

export function GraphDetailPanel({ selectedNodeId, onClose, nodos, edges }: GraphDetailPanelProps) {
  if (!selectedNodeId) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 mb-3">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">Selecciona un nodo</p>
          <p className="text-[11px] text-gray-400 mt-1">
            Haz click en un nodo del grafo para ver sus detalles y conexiones
          </p>
        </div>
      </div>
    );
  }

  const node = nodos.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const nodeEdges = edges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId);
  const connectedIds = new Set(
    nodeEdges.flatMap((e) => [e.source, e.target]).filter((id) => id !== selectedNodeId)
  );
  const connected = nodos.filter((n) => connectedIds.has(n.id));
  const tipo = node.tipo as NodoTipo;
  const meta = node.metadata;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100" style={{ backgroundColor: node.color + "12" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: node.color }}
            >
              {node.label.charAt(0)}
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{node.label}</h3>
              <p className="text-[10px] text-gray-500">{NODO_TIPO_LABELS[tipo]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Metadata */}
        <div className="space-y-2">
          <SectionTitle>Informacion</SectionTitle>
          <div className="space-y-1.5">
            {!!meta.departamento && <MetaItem label="Departamento" value={meta.departamento as string} />}
            {!!meta.partido && <MetaItem label="Partido" value={meta.partido as string} />}
            {!!meta.cargo_actual && <MetaItem label="Cargo actual" value={meta.cargo_actual as string} />}
            {!!meta.cargo && tipo === "familiar" && <MetaItem label="Actividad" value={meta.cargo as string} />}
            {!!meta.parentesco && <MetaItem label="Vinculo" value={meta.parentesco as string} />}
            {!!meta.entidad && <MetaItem label="Entidad" value={meta.entidad as string} />}
            {!!meta.nivel && <MetaItem label="Nivel" value={meta.nivel as string} />}
            {!!meta.nit && <MetaItem label="NIT" value={meta.nit as string} />}
            {!!meta.contratos && <MetaItem label="Contratos" value={`${meta.contratos} por ${meta.valor_total}`} />}
            {!!meta.sigla && <MetaItem label="Sigla" value={meta.sigla as string} />}
            {!!meta.ideologia && <MetaItem label="Ideologia" value={meta.ideologia as string} />}
          </div>
          {(meta.alertas as number) > 0 && (
            <div className="rounded-xl bg-red-50 p-2.5 mt-2">
              <p className="text-[10px] font-semibold text-red-600">
                {String(meta.alertas)} alerta{(meta.alertas as number) > 1 ? "s" : ""} activa{(meta.alertas as number) > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {/* Connections */}
        <div className="space-y-2">
          <SectionTitle>Conexiones ({nodeEdges.length})</SectionTitle>
          <div className="space-y-1.5">
            {nodeEdges.map((edge, i) => {
              const otherId = edge.source === selectedNodeId ? edge.target : edge.source;
              const otherNode = connected.find((n) => n.id === otherId);
              if (!otherNode) return null;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2"
                >
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: otherNode.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-gray-800 truncate">
                      {otherNode.label}
                    </p>
                    <p className="text-[9px] text-gray-400">
                      {EDGE_TIPO_LABELS[edge.tipo] || edge.tipo} — {edge.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
      {children}
    </p>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-700 text-right">{value}</span>
    </div>
  );
}
