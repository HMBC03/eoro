"use client";

import type { DepartmentStats, MapMetric } from "@/data/geo/department-stats";
import { getMetricValue } from "@/data/geo/department-stats";
import { formatCOP } from "@/lib/formatters";

interface DepartmentTooltipProps {
  stats: DepartmentStats | null;
  metric: MapMetric;
  position: { x: number; y: number } | null;
}

const METRIC_LABELS: Record<MapMetric, string> = {
  candidatos: "Candidatos",
  contratos: "Contratos",
  alertas: "Alertas",
};

const METRIC_COLORS: Record<MapMetric, string> = {
  candidatos: "text-emerald-700",
  contratos: "text-sky-700",
  alertas: "text-red-600",
};

export function DepartmentTooltip({ stats, metric, position }: DepartmentTooltipProps) {
  if (!stats || !position) return null;

  const value = getMetricValue(stats, metric);

  // Clamp position to avoid overflow
  const x = Math.min(position.x + 14, (typeof window !== "undefined" ? window.innerWidth : 1200) - 220);
  const y = Math.min(position.y + 14, (typeof window !== "undefined" ? window.innerHeight : 800) - 160);

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100 px-4 py-3 min-w-[180px]"
      style={{ left: x, top: y }}
    >
      <p className="font-semibold text-gray-900 text-sm">{stats.nombre}</p>
      <p className="text-[11px] text-gray-400">{stats.capital}</p>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={`text-lg font-bold ${METRIC_COLORS[metric]}`}>
          {value.toLocaleString("es-CO")}
        </span>
        <span className="text-[11px] text-gray-400">{METRIC_LABELS[metric]}</span>
      </div>

      {metric === "contratos" && (
        <p className="text-[11px] text-gray-400 mt-0.5">
          Valor: {formatCOP(stats.valorContratos)}
        </p>
      )}

      <div className="mt-2 flex gap-3 text-[10px] text-gray-400">
        {metric !== "candidatos" && (
          <span>{stats.numCandidatos} candidatos</span>
        )}
        {metric !== "contratos" && (
          <span>{stats.numContratos} contratos</span>
        )}
        {metric !== "alertas" && (
          <span>{stats.numAlertas} alertas</span>
        )}
      </div>
    </div>
  );
}
