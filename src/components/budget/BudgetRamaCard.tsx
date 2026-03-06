"use client";

import type { RamaGobierno } from "@/lib/types";

const RAMA_COLORS: Record<string, string> = {
  "Rama Ejecutiva": "#1a56db",
  "Rama Legislativa": "#d35400",
  "Rama Judicial": "#6b21a8",
};

const RAMA_ICONS: Record<string, string> = {
  "Rama Ejecutiva": "M3 21V3h18v18H3zm2-2h14V5H5v14zm3-2h2v-6H8v6zm4 0h2V9h-2v8zm4 0h2v-4h-2v4z",
  "Rama Legislativa": "M12 2L2 7v2h20V7L12 2zm0 2.26L18.18 7H5.82L12 4.26zM2 22h20v-2H2v2zM4 11v7h3v-7H4zm5 0v7h3v-7H9zm5 0v7h3v-7h-3zm5 0v7h3v-7h-3z",
  "Rama Judicial": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
};

function formatBillones(value: number): string {
  const billones = value / 1_000_000_000_000;
  if (billones >= 1) return `$${billones.toFixed(1)}B`;
  const miles = value / 1_000_000_000;
  return `$${miles.toFixed(0)}MM`;
}

interface BudgetRamaCardProps {
  rama: RamaGobierno;
  maxPresupuesto: number;
  onClick: () => void;
}

export function BudgetRamaCard({ rama, maxPresupuesto, onClick }: BudgetRamaCardProps) {
  const color = RAMA_COLORS[rama.nombre] ?? "#6B7280";
  const iconPath = RAMA_ICONS[rama.nombre];
  const barWidth = Math.max(8, (rama.presupuesto_total / maxPresupuesto) * 100);

  const ejecucionPromedio = rama.entidades.length > 0
    ? Math.round(rama.entidades.reduce((s, e) => s + e.porcentaje_ejecucion, 0) / rama.entidades.length)
    : 0;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          {iconPath ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill={color}>
              <path d={iconPath} />
            </svg>
          ) : (
            <span className="text-lg font-bold" style={{ color }}>
              {rama.nombre[0]}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700">
            {rama.nombre}
          </h3>
          <p className="text-2xl font-extrabold mt-1" style={{ color }}>
            {formatBillones(rama.presupuesto_total)}
          </p>
        </div>
        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>

      {/* Proportional bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>% del PGN</span>
          <span className="font-semibold" style={{ color }}>{rama.porcentaje_pgn}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${barWidth}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-500">
          <span className="font-semibold text-gray-700">{rama.entidades.length}</span>
          entidades
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5 text-gray-500">
          Ejecucion
          <span className="font-semibold text-gray-700">{ejecucionPromedio}%</span>
        </div>
      </div>
    </button>
  );
}
