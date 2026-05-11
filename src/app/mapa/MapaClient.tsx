"use client";

import { useState, useMemo, useCallback } from "react";
import { ColombiaMap } from "@/components/map/ColombiaMap";
import { DepartmentTooltip } from "@/components/map/DepartmentTooltip";
import { MapLegend } from "@/components/map/MapLegend";
import { MapControls } from "@/components/map/MapControls";
import { DepartmentPanel } from "@/components/map/DepartmentPanel";
import { useMapColorScale } from "@/hooks/useMapColorScale";
import type { CandidatoCompleto } from "@/lib/types";
import type { DepartmentStats, MapMetric } from "@/data/geo/department-stats";

interface MapaClientProps {
  statsArray: DepartmentStats[];
  allCandidatos: CandidatoCompleto[];
}

function getMetricValue(stats: DepartmentStats, metric: MapMetric): number {
  switch (metric) {
    case "candidatos":
      return stats.numCandidatos;
    case "contratos":
      return stats.numContratos;
    case "alertas":
      return stats.numAlertas;
  }
}

export default function MapaClient({ statsArray, allCandidatos }: MapaClientProps) {
  const statsMap = useMemo(() => {
    const map = new Map<string, DepartmentStats>();
    for (const s of statsArray) map.set(s.svgId, s);
    return map;
  }, [statsArray]);

  const [metric, setMetric] = useState<MapMetric>("candidatos");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const colorScale = useMapColorScale(statsArray, metric);

  const metricRange = useMemo(() => {
    const values = statsArray.map((s) => getMetricValue(s, metric));
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [statsArray, metric]);

  const selectedStats = selectedDept ? statsMap.get(selectedDept) ?? null : null;

  // Filter candidates for selected department
  const deptCandidates = useMemo(() => {
    if (!selectedStats) return [];
    return allCandidatos.filter(
      (c) => c.persona.departamento_origen === selectedStats.nombre
    );
  }, [allCandidatos, selectedStats]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeaveMap = useCallback(() => {
    setTooltipPos(null);
    setHoveredDept(null);
  }, []);

  const totalCandidatos = useMemo(
    () => statsArray.reduce((sum, d) => sum + d.numCandidatos, 0),
    [statsArray]
  );

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="px-6 pt-8 pb-4">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="text-3xl font-light text-gray-900">
            Mapa <span className="font-bold">Interactivo</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Explora Colombia por departamento —{" "}
            {totalCandidatos.toLocaleString("es-CO")} candidatos en 32 departamentos y Bogota D.C.
          </p>
        </div>
      </div>

      {/* Main content: map + panel */}
      <div className="mx-auto max-w-[1400px] px-6 pb-12">
        <div className="flex flex-col gap-6">
          {/* Map area */}
          <div className="w-full">
            <div
              className="relative rounded-none bg-white border border-black shadow-[5px_5px_0px_0px_#000] p-4"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeaveMap}
            >
              <MapControls
                metric={metric}
                onMetricChange={setMetric}
                onReset={() => setSelectedDept(null)}
                selectedDept={selectedDept}
              />

              <div className="relative">
                <ColombiaMap
                  stats={statsMap}
                  metric={metric}
                  colorScale={colorScale}
                  selectedDept={selectedDept}
                  hoveredDept={hoveredDept}
                  onSelectDept={setSelectedDept}
                  onHoverDept={setHoveredDept}
                />

                <MapLegend
                  metric={metric}
                  min={metricRange.min}
                  max={metricRange.max}
                  colorScale={colorScale}
                />
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="w-full">
            <div>
              <DepartmentPanel
                stats={selectedStats}
                candidates={deptCandidates}
                onClose={() => setSelectedDept(null)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip (rendered outside map for proper positioning) */}
      <DepartmentTooltip
        stats={hoveredDept ? statsMap.get(hoveredDept) ?? null : null}
        metric={metric}
        position={tooltipPos}
      />
    </div>
  );
}
