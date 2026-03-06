"use client";

import { useMemo } from "react";
import type { MapMetric } from "@/data/geo/department-stats";

interface MapLegendProps {
  metric: MapMetric;
  min: number;
  max: number;
  colorScale: (value: number) => string;
}

const METRIC_LABELS: Record<MapMetric, string> = {
  candidatos: "Candidatos",
  contratos: "Contratos",
  alertas: "Alertas",
};

export function MapLegend({ metric, min, max, colorScale }: MapLegendProps) {
  const gradient = useMemo(() => {
    const steps = 20;
    const colors: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const value = min + (max - min) * (i / steps);
      colors.push(colorScale(value));
    }
    return `linear-gradient(to right, ${colors.join(", ")})`;
  }, [min, max, colorScale]);

  return (
    <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100 px-3 py-2">
      <p className="text-[10px] font-medium text-gray-500 mb-1">
        {METRIC_LABELS[metric]}
      </p>
      <div
        className="h-2 w-32 rounded-full"
        style={{ background: gradient }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[9px] text-gray-400">{min}</span>
        <span className="text-[9px] text-gray-400">{max.toLocaleString("es-CO")}</span>
      </div>
    </div>
  );
}
