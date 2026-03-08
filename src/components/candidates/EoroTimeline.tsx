"use client";

import type { EoroHistorial } from "@/lib/types";
import { cn, formatDateCO } from "@/lib/utils";

interface EoroTimelineProps {
  historial: EoroHistorial[];
}

const EVENT_LABELS: Record<string, string> = {
  evaluacion_creada: "Nueva evaluacion",
  evaluacion_resuelta: "Evaluacion resuelta",
  reporte_verificado: "Reporte verificado",
  reporte_rechazado: "Reporte rechazado",
  restauracion: "Restauracion de puntos",
  recalculo: "Recalculo del score",
};

export function EoroTimeline({ historial }: EoroTimelineProps) {
  if (historial.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-50 p-4 text-center">
        <p className="text-xs text-gray-400">Sin historial de cambios</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {historial.map((h, i) => {
        const diff = h.score_nuevo - h.score_anterior;
        const isNegative = diff < 0;
        return (
          <div key={h.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full shrink-0 mt-1.5",
                  isNegative ? "bg-red-400" : "bg-emerald-400"
                )}
              />
              {i < historial.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 my-1" />
              )}
            </div>
            <div className="flex-1 pb-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700">
                  {EVENT_LABELS[h.evento] ?? h.evento}
                </p>
                <span
                  className={cn(
                    "text-xs font-bold",
                    isNegative ? "text-red-500" : "text-emerald-500"
                  )}
                >
                  {diff > 0 ? "+" : ""}
                  {diff}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {h.score_anterior} → {h.score_nuevo} |{" "}
                {formatDateCO(h.created_at)}
              </p>
              {h.detalle && (
                <p className="text-[10px] text-gray-500 mt-1">{h.detalle}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
