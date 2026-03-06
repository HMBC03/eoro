"use client";

import { useState, useCallback, useMemo } from "react";
import type { GrafoData } from "@/lib/types";
import { NODO_TIPOS, type NodoTipo } from "@/lib/constants/grafo";
import { ForceGraph } from "@/components/graphs/ForceGraph";
import { GraphControls } from "@/components/graphs/GraphControls";
import { GraphDetailPanel } from "@/components/graphs/GraphDetailPanel";

interface ConexionesClientProps {
  grafoData: GrafoData;
}

export default function ConexionesClient({ grafoData }: ConexionesClientProps) {
  const [filteredTypes, setFilteredTypes] = useState<Set<NodoTipo>>(new Set(NODO_TIPOS));
  const [showLabels, setShowLabels] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [resetZoomFn, setResetZoomFn] = useState<(() => void) | null>(null);

  const handleToggleType = (tipo: NodoTipo) => {
    setFilteredTypes((prev) => {
      const next = new Set(prev);
      if (next.has(tipo)) {
        next.delete(tipo);
      } else {
        next.add(tipo);
      }
      return next;
    });
  };

  const handleResetZoomRef = useCallback((fn: () => void) => {
    setResetZoomFn(() => fn);
  }, []);

  // Filter nodes by search
  const filteredNodos = useMemo(() => {
    if (!busqueda || busqueda.length < 2) return grafoData.nodos;
    const q = busqueda.toLowerCase();
    return grafoData.nodos.filter((n) => n.label.toLowerCase().includes(q));
  }, [busqueda, grafoData.nodos]);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light text-gray-900">
            Conexiones <span className="font-bold">Politicas</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Grafo interactivo de redes entre candidatos, familiares, contratos y partidos. Arrastra nodos, haz zoom y click para explorar.
          </p>
        </div>

        {/* Controls */}
        <GraphControls
          filteredTypes={filteredTypes}
          onToggleType={handleToggleType}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(!showLabels)}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onResetZoom={() => resetZoomFn?.()}
        />

        {/* Graph + Panel */}
        <div className="flex gap-4 flex-col lg:flex-row" style={{ height: "calc(100vh - 240px)" }}>
          {/* Graph area */}
          <div className="flex-1 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
            <ForceGraph
              nodos={filteredNodos}
              edges={grafoData.edges}
              filteredTypes={filteredTypes}
              showLabels={showLabels}
              onNodeClick={setSelectedNodeId}
              onResetZoomRef={handleResetZoomRef}
            />
          </div>

          {/* Detail panel */}
          <div className="w-full lg:w-[320px] lg:flex-shrink-0 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <GraphDetailPanel
              selectedNodeId={selectedNodeId}
              onClose={() => setSelectedNodeId(null)}
              nodos={grafoData.nodos}
              edges={grafoData.edges}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400">
          <span className="font-medium text-gray-500 uppercase tracking-wider">Tipos de conexion:</span>
          <LegendItem color="#E76F51" label="Familiar" />
          <LegendItem color="#89B0D0" label="Cargo publico" />
          <LegendItem color="#2D6A4F" label="Contrato" />
          <LegendItem color="#9CA3AF" label="Partido" />
          <LegendItem color="#D97706" label="Financiacion" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block h-2 w-6 rounded-full" style={{ backgroundColor: color, opacity: 0.6 }} />
      <span>{label}</span>
    </div>
  );
}
