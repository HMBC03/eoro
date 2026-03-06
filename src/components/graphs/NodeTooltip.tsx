"use client";

import type { SimNode } from "@/hooks/useForceGraph";
import { NODO_TIPO_LABELS } from "@/lib/constants/grafo";
import type { NodoTipo } from "@/lib/constants/grafo";

interface NodeTooltipProps {
  node: SimNode | null;
  x: number;
  y: number;
}

const TIPO_ICON: Record<NodoTipo, string> = {
  candidato: "person",
  familiar: "family",
  cargo: "building",
  contratista: "briefcase",
  partido: "flag",
};

export function NodeTooltip({ node, x, y }: NodeTooltipProps) {
  if (!node) return null;

  const meta = node.metadata;
  const tipo = node.tipo as NodoTipo;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-xl bg-gray-900 px-4 py-3 text-sm shadow-xl"
      style={{ left: x + 14, top: y - 10 }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: node.color }}
        />
        <span className="font-semibold text-white text-xs">{node.label}</span>
      </div>
      <p className="text-[10px] text-gray-400 mb-1">
        {NODO_TIPO_LABELS[tipo]} {TIPO_ICON[tipo] === "person" ? "" : ""}
      </p>
      <div className="space-y-0.5">
        {!!meta.departamento && (
          <MetaRow label="Depto" value={meta.departamento as string} />
        )}
        {!!meta.partido && (
          <MetaRow label="Partido" value={meta.partido as string} />
        )}
        {!!meta.cargo_actual && (
          <MetaRow label="Cargo" value={meta.cargo_actual as string} />
        )}
        {!!meta.cargo && tipo === "familiar" && (
          <MetaRow label="Actividad" value={meta.cargo as string} />
        )}
        {!!meta.parentesco && (
          <MetaRow label="Vinculo" value={meta.parentesco as string} />
        )}
        {!!meta.entidad && (
          <MetaRow label="Entidad" value={meta.entidad as string} />
        )}
        {!!meta.contratos && (
          <MetaRow label="Contratos" value={`${meta.contratos} (${meta.valor_total})`} />
        )}
        {!!meta.sigla && (
          <MetaRow label="Sigla" value={meta.sigla as string} />
        )}
        {!!meta.ideologia && (
          <MetaRow label="Ideologia" value={meta.ideologia as string} />
        )}
        {(meta.alertas as number) > 0 && (
          <p className="text-[10px] text-red-400 mt-1">
            {String(meta.alertas)} alerta{(meta.alertas as number) > 1 ? "s" : ""} activa{(meta.alertas as number) > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[10px] text-gray-400">
      {label}: <span className="text-gray-200">{value}</span>
    </p>
  );
}
