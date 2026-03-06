"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCOPShort } from "@/lib/formatters";

interface ContractChartsProps {
  porDepartamento: { nombre: string; count: number; valor: number }[];
  porMes: { fecha: string; count: number; valor: number }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900 px-4 py-3 text-sm shadow-lg">
      <p className="font-medium text-white text-xs">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-gray-400 text-[11px]">
          {entry.name === "valor" ? "Valor" : "Contratos"}:{" "}
          <span className="text-white font-medium">
            {entry.name === "valor" ? formatCOPShort(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export function ContractCharts({ porDepartamento, porMes }: ContractChartsProps) {
  const topDeptos = porDepartamento.slice(0, 10);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bar chart: Contratos por departamento */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Contratos por departamento</h3>
        <p className="text-[11px] text-gray-400 mb-4">Top 10 departamentos por numero de contratos</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topDeptos} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
            <YAxis
              type="category"
              dataKey="nombre"
              tick={{ fontSize: 10, fill: "#6B7280" }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="count" fill="#1B4332" radius={[0, 4, 4, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart: Valor en el tiempo */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Valor contractual en el tiempo</h3>
        <p className="text-[11px] text-gray-400 mb-4">Valor total de contratos firmados por mes</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={porMes} margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="fecha"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickFormatter={(v: string) => {
                const [y, m] = v.split("-");
                const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                return `${months[Number(m) - 1]} ${y.slice(2)}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickFormatter={(v: number) => formatCOPShort(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="valor"
              name="valor"
              stroke="#003893"
              strokeWidth={2}
              dot={{ r: 3, fill: "#003893" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
