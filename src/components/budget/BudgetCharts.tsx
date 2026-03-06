"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { RamaGobierno, EntidadPresupuestal } from "@/lib/types";

const RAMA_COLORS: Record<string, string> = {
  "Rama Ejecutiva": "#1a56db",
  "Rama Legislativa": "#d35400",
  "Rama Judicial": "#6b21a8",
};

function formatBillones(value: number): string {
  const billones = value / 1_000_000_000_000;
  if (billones >= 1) return `$${billones.toFixed(1)}B`;
  const miles = value / 1_000_000_000;
  return `$${miles.toFixed(0)}MM`;
}

interface BudgetChartsProps {
  ramas: RamaGobierno[];
  topEntidades: EntidadPresupuestal[];
}

export function BudgetCharts({ ramas, topEntidades }: BudgetChartsProps) {
  const ramaData = ramas.map((r) => ({
    nombre: r.nombre.replace("Rama ", ""),
    presupuesto: r.presupuesto_total,
    porcentaje: r.porcentaje_pgn,
    color: RAMA_COLORS[r.nombre] ?? "#6B7280",
  }));

  const entidadData = topEntidades.map((e) => ({
    nombre: e.nombre.replace("Ministerio de ", "Min. ").replace("Ministerio del ", "Min. "),
    presupuesto: e.presupuesto_asignado,
    ejecucion: e.porcentaje_ejecucion,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ramas bar chart */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Presupuesto por Rama</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ramaData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tickFormatter={formatBillones} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="nombre" width={80} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(val) => formatBillones(val as number)}
              labelStyle={{ fontWeight: 700 }}
            />
            <Bar dataKey="presupuesto" radius={[0, 6, 6, 0]} barSize={28}>
              {ramaData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top entidades bar chart */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Top 10 Entidades por Presupuesto</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={entidadData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tickFormatter={formatBillones} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="nombre" width={90} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(val, name) =>
                name === "ejecucion" ? `${val}%` : formatBillones(val as number)
              }
              labelStyle={{ fontWeight: 700 }}
            />
            <Bar dataKey="presupuesto" fill="#1a56db" radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
