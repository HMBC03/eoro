"use client";

import type { EntidadPresupuestal } from "@/lib/types";

function formatBillones(value: number): string {
  const billones = value / 1_000_000_000_000;
  if (billones >= 1) return `$${billones.toFixed(1)}B`;
  const miles = value / 1_000_000_000;
  if (miles >= 1) return `$${miles.toFixed(0)}MM`;
  const millones = value / 1_000_000;
  return `$${millones.toFixed(0)}M`;
}

const TIPO_LABELS: Record<string, string> = {
  ministerio: "Ministerio",
  departamento_admin: "Entidad",
  corporacion: "Corporacion",
  corte: "Rama Judicial",
  organo_control: "Organo de Control",
  otro: "Otro",
};

interface BudgetEntidadCardProps {
  entidad: EntidadPresupuestal;
  onClick: () => void;
}

export function BudgetEntidadCard({ entidad, onClick }: BudgetEntidadCardProps) {
  const ejecColor =
    entidad.porcentaje_ejecucion >= 80
      ? "#16a34a"
      : entidad.porcentaje_ejecucion >= 60
        ? "#ca8a04"
        : "#dc2626";

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl bg-white border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-gray-700 truncate">
            {entidad.nombre}
          </h4>
          <span className="inline-block mt-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
            {TIPO_LABELS[entidad.tipo] ?? entidad.tipo}
          </span>
        </div>
        <svg className="h-4 w-4 text-gray-400 group-hover:text-gray-600 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>

      {/* Budget bars */}
      <div className="mt-4 space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Asignado</span>
            <span className="font-semibold text-gray-700">{formatBillones(entidad.presupuesto_asignado)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-blue-500" style={{ width: "100%" }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Ejecutado</span>
            <span className="font-semibold" style={{ color: ejecColor }}>
              {entidad.porcentaje_ejecucion}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${entidad.porcentaje_ejecucion}%`, backgroundColor: ejecColor }}
            />
          </div>
        </div>
      </div>

      {/* Contracts info */}
      {entidad.num_contratos > 0 && (
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
          <span>
            <span className="font-semibold text-gray-700">{entidad.num_contratos}</span> contratos
          </span>
          <span className="h-3 w-px bg-gray-200" />
          <span className="font-semibold text-gray-700">{formatBillones(entidad.valor_contratos)}</span>
        </div>
      )}
    </button>
  );
}
