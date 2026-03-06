"use client";

import { SearchBar } from "@/components/ui/SearchBar";
import { NODO_TIPOS, NODO_TIPO_LABELS } from "@/lib/constants/grafo";
import type { NodoTipo } from "@/lib/constants/grafo";
import { colors } from "@/styles/colors";

interface GraphControlsProps {
  filteredTypes: Set<NodoTipo>;
  onToggleType: (tipo: NodoTipo) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  busqueda: string;
  onBusquedaChange: (v: string) => void;
  onResetZoom: () => void;
}

const TIPO_COLORS: Record<NodoTipo, string> = {
  candidato: colors.nodos.candidato,
  familiar: colors.nodos.familiar,
  cargo: colors.nodos.cargo,
  contratista: colors.nodos.contratista,
  partido: colors.nodos.partido,
};

export function GraphControls({
  filteredTypes,
  onToggleType,
  showLabels,
  onToggleLabels,
  busqueda,
  onBusquedaChange,
  onResetZoom,
}: GraphControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Node type pills */}
      <div className="flex gap-1 rounded-full bg-gray-100/70 p-1">
        {NODO_TIPOS.map((tipo) => {
          const active = filteredTypes.has(tipo);
          return (
            <button
              key={tipo}
              onClick={() => onToggleType(tipo)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                active
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: TIPO_COLORS[tipo], opacity: active ? 1 : 0.3 }}
              />
              {NODO_TIPO_LABELS[tipo]}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="min-w-[160px] flex-1 max-w-[240px]">
        <SearchBar
          onSearch={onBusquedaChange}
          placeholder="Buscar nodo..."
          size="sm"
        />
      </div>

      {/* Toggle labels */}
      <button
        onClick={onToggleLabels}
        className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
          showLabels
            ? "bg-gray-900 text-white"
            : "bg-gray-100/70 text-gray-500 hover:text-gray-700"
        }`}
      >
        Etiquetas
      </button>

      {/* Reset zoom */}
      <button
        onClick={onResetZoom}
        className="rounded-full bg-gray-100/70 px-3 py-1.5 text-[11px] text-gray-500 hover:text-gray-700 hover:bg-gray-200/70 transition-all"
      >
        Reiniciar zoom
      </button>
    </div>
  );
}
