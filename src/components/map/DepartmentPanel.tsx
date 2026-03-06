"use client";

import Link from "next/link";
import type { DepartmentStats } from "@/data/geo/department-stats";
import type { CandidatoCompleto } from "@/lib/types";
import { formatCOPShort } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";

interface DepartmentPanelProps {
  stats: DepartmentStats | null;
  candidates: CandidatoCompleto[];
  onClose: () => void;
}

const tipoLabels: Record<string, string> = {
  senado: "Senado",
  camara: "Camara",
};

export function DepartmentPanel({ stats, candidates, onClose }: DepartmentPanelProps) {
  if (!stats) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Selecciona un departamento
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Haz clic en el mapa para ver candidatos y datos
        </p>
      </div>
    );
  }

  const displayCandidates = candidates.slice(0, 12);
  const remaining = candidates.length - displayCandidates.length;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-5 py-4 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{stats.nombre}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{stats.capital}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-4">
        <StatCard
          label="Candidatos"
          value={stats.numCandidatos}
          detail={`${stats.numSenado} Sen · ${stats.numCamara} Cam`}
          bg="bg-emerald-50"
          text="text-emerald-700"
        />
        <StatCard
          label="Contratos"
          value={stats.numContratos}
          detail={formatCOPShort(stats.valorContratos)}
          bg="bg-sky-50"
          text="text-sky-700"
        />
        <StatCard
          label="Alertas"
          value={stats.numAlertas}
          detail=""
          bg="bg-red-50"
          text="text-red-600"
        />
      </div>

      {/* Top parties */}
      {stats.topPartidos.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">
            Partidos principales
          </p>
          <div className="space-y-1.5">
            {stats.topPartidos.slice(0, 4).map((p) => (
              <div key={p.sigla} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-xs text-gray-600 truncate flex-1">{p.nombre}</span>
                <span className="text-xs font-medium text-gray-900">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate list */}
      <div className="border-t border-gray-100">
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Candidatos ({candidates.length})
          </p>
        </div>
        <div className="max-h-[340px] overflow-y-auto px-4 pb-3 space-y-1">
          {displayCandidates.map((c) => (
            <Link
              key={c.persona.id}
              href={`/candidatos/${c.persona.id}`}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 hover:bg-gray-50 transition-colors group"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{ backgroundColor: c.partido.color_hex }}
              >
                {getInitials(c.persona.nombre_completo)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate group-hover:text-gray-600 transition-colors">
                  {c.persona.nombre_completo}
                </p>
                <p className="text-[10px] text-gray-400">
                  {c.partido.sigla} · {tipoLabels[c.candidatura_actual.tipo] ?? c.candidatura_actual.tipo}
                </p>
              </div>
            </Link>
          ))}
          {remaining > 0 && (
            <p className="text-center text-[11px] text-gray-400 py-2">
              +{remaining} candidatos mas
            </p>
          )}
        </div>

        {/* Link to full list */}
        <div className="border-t border-gray-100 p-3">
          <Link
            href={`/candidatos?depto=${encodeURIComponent(stats.nombre)}`}
            className="block w-full text-center rounded-xl bg-gray-900 text-white text-xs font-medium py-2.5 hover:bg-gray-800 transition-colors"
          >
            Ver todos en {stats.nombre}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  bg,
  text,
}: {
  label: string;
  value: number;
  detail: string;
  bg: string;
  text: string;
}) {
  return (
    <div className={`rounded-xl ${bg} p-3 text-center`}>
      <p className={`text-xl font-bold ${text}`}>
        {value.toLocaleString("es-CO")}
      </p>
      <p className="text-[10px] font-medium text-gray-500 mt-0.5">{label}</p>
      {detail && (
        <p className="text-[9px] text-gray-400 mt-0.5">{detail}</p>
      )}
    </div>
  );
}
