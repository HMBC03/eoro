"use client";

import { useState, useMemo } from "react";
import { BudgetRamaCard } from "@/components/budget/BudgetRamaCard";
import { BudgetEntidadCard } from "@/components/budget/BudgetEntidadCard";
import { BudgetCharts } from "@/components/budget/BudgetCharts";
import { formatCOPShort } from "@/lib/formatters";
import type { RamaGobierno, EntidadPresupuestal, ContratoConVotos } from "@/lib/types";

interface PresupuestoStats {
  pgn_total: number;
  ejecucion_promedio: number;
  entidades_total: number;
  total_contratos: number;
  top_entidades: EntidadPresupuestal[];
}

interface PresupuestoClientProps {
  pgnTotal: number;
  ramas: RamaGobierno[];
  stats: PresupuestoStats;
  allContratos: ContratoConVotos[];
}

function formatBillones(value: number): string {
  const billones = value / 1_000_000_000_000;
  if (billones >= 1) return `$${billones.toFixed(1)}B`;
  const miles = value / 1_000_000_000;
  if (miles >= 1) return `$${miles.toFixed(0)} mil M`;
  return formatCOPShort(value);
}

export default function PresupuestoClient({ pgnTotal, ramas, stats, allContratos }: PresupuestoClientProps) {
  const [selectedRama, setSelectedRama] = useState<string | null>(null);
  const [selectedEntidad, setSelectedEntidad] = useState<string | null>(null);

  const rama = selectedRama ? ramas.find((r) => r.id === selectedRama) : null;
  const entidad = selectedEntidad
    ? ramas.flatMap((r) => r.entidades).find((e) => e.id === selectedEntidad)
    : null;

  const entidadContratos = useMemo(() => {
    if (!entidad) return [];
    return allContratos.filter((c) => c.entidad_nombre === entidad.nombre);
  }, [entidad, allContratos]);

  const maxPresupuesto = Math.max(...ramas.map((r) => r.presupuesto_total));

  function goBack() {
    if (selectedEntidad) {
      setSelectedEntidad(null);
    } else if (selectedRama) {
      setSelectedRama(null);
    }
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light text-gray-900">
            Presupuesto <span className="font-bold">General de la Nacion 2025</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Distribucion del PGN por ramas del poder publico, entidades y ejecucion presupuestal.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="PGN Total" value={formatBillones(pgnTotal)} icon="money" />
          <StatCard label="Ejecucion promedio" value={`${stats.ejecucion_promedio}%`} icon="chart" />
          <StatCard label="Entidades" value={stats.entidades_total.toString()} icon="building" />
          <StatCard label="Contratos vinculados" value={stats.total_contratos.toString()} icon="doc" />
        </div>

        {/* Breadcrumb */}
        {(selectedRama || selectedEntidad) && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => { setSelectedRama(null); setSelectedEntidad(null); }}
              className="text-blue-600 hover:underline font-medium"
            >
              PGN 2025
            </button>
            {rama && (
              <>
                <span className="text-gray-400">/</span>
                {selectedEntidad ? (
                  <button
                    onClick={() => setSelectedEntidad(null)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {rama.nombre}
                  </button>
                ) : (
                  <span className="text-gray-700 font-medium">{rama.nombre}</span>
                )}
              </>
            )}
            {entidad && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-700 font-medium">{entidad.nombre}</span>
              </>
            )}
          </div>
        )}

        {/* Back button */}
        {(selectedRama || selectedEntidad) && (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver
          </button>
        )}

        {/* Level 0: Ramas overview */}
        {!selectedRama && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ramas.map((r) => (
                <BudgetRamaCard
                  key={r.id}
                  rama={r}
                  maxPresupuesto={maxPresupuesto}
                  onClick={() => setSelectedRama(r.id)}
                />
              ))}
            </div>
            <BudgetCharts ramas={ramas} topEntidades={stats.top_entidades} />
          </>
        )}

        {/* Level 1: Entidades of selected rama */}
        {rama && !selectedEntidad && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{rama.nombre}</h2>
              <span className="text-sm text-gray-400">
                {rama.entidades.length} entidades — {formatBillones(rama.presupuesto_total)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rama.entidades.map((ent) => (
                <BudgetEntidadCard
                  key={ent.id}
                  entidad={ent}
                  onClick={() => setSelectedEntidad(ent.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Level 2: Entidad detail + contracts */}
        {entidad && (
          <>
            {/* Entidad stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Presupuesto asignado" value={formatBillones(entidad.presupuesto_asignado)} icon="money" />
              <StatCard label="Ejecutado" value={`${entidad.porcentaje_ejecucion}%`} icon="chart" />
              <StatCard label="Contratos" value={entidad.num_contratos.toString()} icon="doc" />
              <StatCard label="Valor contratos" value={formatCOPShort(entidad.valor_contratos)} icon="building" />
            </div>

            {/* Contract list */}
            {entidadContratos.length > 0 ? (
              <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">
                    Contratos de {entidad.nombre}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                        <th className="px-5 py-3">Contratista</th>
                        <th className="px-5 py-3">Objeto</th>
                        <th className="px-5 py-3 text-right">Valor</th>
                        <th className="px-5 py-3">Estado</th>
                        <th className="px-5 py-3">Depto.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entidadContratos.map((c) => (
                        <ContractRow key={c.id} contrato={c} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-gray-200 p-8 text-center">
                <p className="text-sm text-gray-400">
                  No hay contratos vinculados a esta entidad en los datos actuales.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- Local helper components ---

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    doc: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    money: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    chart: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    building: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-[#c4e615]">
        {icons[icon]}
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-[11px] text-gray-400">{label}</p>
      </div>
    </div>
  );
}

const ESTADO_STYLES: Record<string, string> = {
  activo: "bg-emerald-50 text-emerald-700",
  finalizado: "bg-blue-50 text-blue-700",
  liquidado: "bg-gray-100 text-gray-500",
  terminado_anticipadamente: "bg-red-50 text-red-600",
};

function ContractRow({ contrato }: { contrato: ContratoConVotos }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3 font-medium text-gray-900 max-w-[200px] truncate">
        {contrato.contratista_nombre}
      </td>
      <td className="px-5 py-3 text-gray-500 max-w-[300px] truncate">
        {contrato.objeto}
      </td>
      <td className="px-5 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
        {formatCOPShort(contrato.valor_contrato)}
      </td>
      <td className="px-5 py-3">
        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${ESTADO_STYLES[contrato.estado] ?? "bg-gray-100 text-gray-500"}`}>
          {contrato.estado.replace("_", " ")}
        </span>
      </td>
      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
        {contrato.departamento}
      </td>
    </tr>
  );
}
