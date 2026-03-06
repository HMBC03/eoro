"use client";

import { useState, useMemo } from "react";
import type { ContratoConVotos } from "@/lib/types";
import type { ContratoScore } from "@/lib/contract-score";
import { formatCOPShort, formatDateShort } from "@/lib/formatters";
import { VoteButtons } from "./VoteButtons";
import { ContractScoreBadge } from "./ContractScoreBadge";

interface ContractTableProps {
  contratos: ContratoConVotos[];
  scores: Map<string, ContratoScore>;
  onSelectContrato: (id: string) => void;
  getUserVote: (id: string) => "valida" | "cuestiona" | null;
  getCounts: (id: string) => { valida: number; cuestiona: number };
  onVote: (id: string, type: "valida" | "cuestiona") => void;
}

type SortKey = "contratista" | "entidad" | "valor" | "departamento" | "estado" | "fecha" | "riesgo";
type SortDir = "asc" | "desc";

const ESTADO_STYLES: Record<string, string> = {
  activo: "bg-emerald-50 text-emerald-700",
  finalizado: "bg-blue-50 text-blue-700",
  liquidado: "bg-gray-100 text-gray-500",
  terminado_anticipadamente: "bg-red-50 text-red-600",
};

const ESTADO_LABELS: Record<string, string> = {
  activo: "Activo",
  finalizado: "Finalizado",
  liquidado: "Liquidado",
  terminado_anticipadamente: "Terminado",
};

const PER_PAGE = 15;

export function ContractTable({
  contratos,
  scores,
  onSelectContrato,
  getUserVote,
  getCounts,
  onVote,
}: ContractTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("valor");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const arr = [...contratos];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "contratista": cmp = a.contratista_nombre.localeCompare(b.contratista_nombre); break;
        case "entidad": cmp = a.entidad_nombre.localeCompare(b.entidad_nombre); break;
        case "valor": cmp = a.valor_contrato - b.valor_contrato; break;
        case "departamento": cmp = a.departamento.localeCompare(b.departamento); break;
        case "estado": cmp = a.estado.localeCompare(b.estado); break;
        case "fecha": cmp = a.fecha_firma.localeCompare(b.fecha_firma); break;
        case "riesgo": cmp = (scores.get(a.id)?.total ?? 0) - (scores.get(b.id)?.total ?? 0); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [contratos, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paged = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return (
      <svg className="inline h-3 w-3 ml-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        {sortDir === "asc"
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        }
      </svg>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/80 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort("contratista")}>
                Contratista <SortIcon col="contratista" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-gray-600 hidden md:table-cell" onClick={() => handleSort("entidad")}>
                Entidad <SortIcon col="entidad" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-gray-600 text-right" onClick={() => handleSort("valor")}>
                Valor <SortIcon col="valor" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-gray-600 hidden lg:table-cell" onClick={() => handleSort("departamento")}>
                Depto <SortIcon col="departamento" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort("estado")}>
                Estado <SortIcon col="estado" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-gray-600 hidden sm:table-cell" onClick={() => handleSort("fecha")}>
                Fecha <SortIcon col="fecha" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort("riesgo")}>
                Riesgo <SortIcon col="riesgo" />
              </th>
              <th className="px-4 py-3">Votos</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => {
              const counts = getCounts(c.id);
              return (
                <tr
                  key={c.id}
                  className="border-t border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                  onClick={() => onSelectContrato(c.id)}
                >
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-gray-900 truncate max-w-[200px]">
                      {c.contratista_nombre}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px] md:hidden">
                      {c.entidad_nombre}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-gray-600 truncate max-w-[180px]">{c.entidad_nombre}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold text-gray-900">{formatCOPShort(c.valor_contrato)}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-[11px] text-gray-500">{c.departamento}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${ESTADO_STYLES[c.estado] || "bg-gray-100 text-gray-500"}`}>
                      {ESTADO_LABELS[c.estado] || c.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-[11px] text-gray-400">{formatDateShort(c.fecha_firma)}</span>
                  </td>
                  <td className="px-4 py-3">
                    {scores.get(c.id) && <ContractScoreBadge score={scores.get(c.id)!} size="sm" />}
                  </td>
                  <td className="px-4 py-3">
                    <VoteButtons
                      contratoId={c.id}
                      validaCount={counts.valida}
                      cuestionaCount={counts.cuestiona}
                      userVote={getUserVote(c.id)}
                      onVote={onVote}
                      compact
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-[11px] text-gray-400">
            {page * PER_PAGE + 1}-{Math.min((page + 1) * PER_PAGE, sorted.length)} de {sorted.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="rounded-lg px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
