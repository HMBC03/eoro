"use client";

import type { ContratoScore } from "@/lib/contract-score";
import { cn } from "@/lib/utils";

interface ContractScoreBadgeProps {
  score: ContratoScore;
  size?: "sm" | "md";
}

const SEMAFORO_STYLES = {
  verde: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", bar: "bg-emerald-400" },
  amarillo: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", bar: "bg-amber-400" },
  naranja: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", bar: "bg-orange-400" },
  rojo: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", bar: "bg-red-400" },
};

const INDICADOR_LABELS: Record<string, { label: string; max: number }> = {
  vencido_sin_entregar: { label: "Vencido", max: 25 },
  adiciones_excesivas: { label: "Adiciones", max: 25 },
  contratacion_directa_alto_valor: { label: "Directa", max: 20 },
  concentracion_contratista: { label: "Concentracion", max: 15 },
  vinculo_familiar_funcionario: { label: "Familiar", max: 15 },
};

export function ContractScoreBadge({ score, size = "sm" }: ContractScoreBadgeProps) {
  const s = SEMAFORO_STYLES[score.semaforo];

  if (size === "sm") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
          s.bg, s.text, s.ring
        )}
      >
        {score.total}
      </span>
    );
  }

  // size === "md" — detailed breakdown card
  return (
    <div className={cn("rounded-2xl p-4", s.bg)}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold", s.bg, s.text)}>
          {score.total}
        </div>
        <div>
          <p className={cn("text-sm font-semibold", s.text)}>
            Riesgo {score.semaforo === "verde" ? "bajo" : score.semaforo === "amarillo" ? "moderado" : score.semaforo === "naranja" ? "alto" : "critico"}
          </p>
          <p className="text-[10px] text-gray-500">Indice de riesgo contractual (0-100)</p>
        </div>
      </div>
      <div className="space-y-2">
        {Object.entries(score.indicadores).map(([key, value]) => {
          const info = INDICADOR_LABELS[key];
          if (!info) return null;
          const pct = (value / info.max) * 100;
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-[10px] mb-0.5">
                <span className="text-gray-500">{info.label}</span>
                <span className={cn("font-semibold", value > 0 ? s.text : "text-gray-300")}>
                  {value}/{info.max}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/60">
                <div
                  className={cn("h-1.5 rounded-full transition-all", value > 0 ? s.bar : "bg-gray-200")}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
