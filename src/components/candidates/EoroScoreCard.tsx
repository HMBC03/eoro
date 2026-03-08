"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { EoroScoreCache } from "@/lib/types";
import {
  getEoroScoreColor,
  getEoroScoreBg,
  getEoroScoreLabel,
} from "@/lib/utils";

interface EoroScoreCardProps {
  score: EoroScoreCache;
}

const CATEGORY_LABELS: Record<string, string> = {
  integridad_juridica: "Integridad",
  clan_politico: "Clan Politico",
  financiacion_patrimonio: "Financiacion",
  transparencia_rendicion: "Transparencia",
  vinculos_ilegales: "Vinculos",
  reporte_ciudadano: "Rep. Ciudadano",
};

export function EoroScoreCard({ score }: EoroScoreCardProps) {
  const color = getEoroScoreColor(score.score_total);
  const bg = getEoroScoreBg(score.score_total);
  const label = getEoroScoreLabel(score.score_total);

  // Radar data: value = max - restado (how much is "intact")
  const radarData = Object.entries(score.desglose_categorias).map(
    ([slug, d]) => ({
      category: CATEGORY_LABELS[slug] ?? slug,
      value: d.max - d.restado,
      fullMark: d.max,
    })
  );

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Eoro Score
      </p>

      {/* Score + Tier */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold"
          style={{ backgroundColor: bg, color }}
        >
          {score.score_total}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color }}>
            {label}
          </p>
          <p className="text-[10px] text-gray-400">
            {score.num_evaluaciones} evaluacion
            {score.num_evaluaciones !== 1 ? "es" : ""}
            {score.num_reportes_verificados > 0 &&
              ` · ${score.num_reportes_verificados} reporte${score.num_reportes_verificados !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Radar Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 9, fill: "#6b7280" }}
          />
          <Radar
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Category breakdown bars */}
      <div className="mt-4 space-y-2">
        {Object.entries(score.desglose_categorias).map(([slug, d]) => {
          const intact = d.max - d.restado;
          const pct = (intact / d.max) * 100;
          return (
            <div key={slug}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-gray-500">
                  {CATEGORY_LABELS[slug] ?? slug}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: d.restado > 0 ? "#c0392b" : "#27ae60" }}
                >
                  -{d.restado}/{d.max}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: d.restado > 0 ? "#d35400" : "#27ae60",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
