"use client";

import type { MapMetric } from "@/data/geo/department-stats";

interface MapControlsProps {
  metric: MapMetric;
  onMetricChange: (metric: MapMetric) => void;
  onReset: () => void;
  selectedDept: string | null;
}

const METRICS: { value: MapMetric; label: string }[] = [
  { value: "candidatos", label: "Candidatos" },
  { value: "contratos", label: "Contratos" },
  { value: "alertas", label: "Alertas" },
];

export function MapControls({
  metric,
  onMetricChange,
  onReset,
  selectedDept,
}: MapControlsProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="inline-flex rounded-full bg-gray-100/70 p-1">
        {METRICS.map((m) => (
          <button
            key={m.value}
            onClick={() => onMetricChange(m.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              metric === m.value
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {selectedDept && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-full bg-gray-100/70 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200/70 transition-all"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Deseleccionar
        </button>
      )}
    </div>
  );
}
