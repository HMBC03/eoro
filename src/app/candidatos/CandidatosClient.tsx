"use client";

import { useState, useMemo } from "react";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { ELECCIONES_PRESIDENCIA_2026 } from "@/lib/constants";
import { daysUntil } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CandidatoCompleto } from "@/lib/types";

type TipoCandidatura = "todos" | "presidencia" | "senado" | "camara";
type OrdenCampo = "nombre" | "score" | "alertas" | "departamento";

interface CandidatosClientProps {
  allCandidatos: CandidatoCompleto[];
  partidos: { id: string; nombre: string }[];
  departamentos: string[];
}

const TIPO_TABS: { value: TipoCandidatura; label: string; icon: React.ReactNode }[] = [
  {
    value: "todos",
    label: "Todos",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    value: "presidencia",
    label: "Presidencia",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    value: "senado",
    label: "Senado",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3" />
      </svg>
    ),
  },
  {
    value: "camara",
    label: "Camara",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const PER_PAGE = 60;

export default function CandidatosClient({ allCandidatos, partidos, departamentos }: CandidatosClientProps) {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoCandidatura>("todos");
  const [partidoFiltro, setPartidoFiltro] = useState<string>("todos");
  const [deptoFiltro, setDeptoFiltro] = useState<string>("todos");
  const [orden, setOrden] = useState<OrdenCampo>("nombre");
  const [page, setPage] = useState(1);

  const diasParaElecciones = daysUntil(ELECCIONES_PRESIDENCIA_2026);

  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const candidatosFiltrados = useMemo(() => {
    let resultado = [...allCandidatos];

    if (tipoFiltro !== "todos") {
      resultado = resultado.filter((c) => c.candidatura_actual.tipo === tipoFiltro);
    }
    if (partidoFiltro !== "todos") {
      resultado = resultado.filter((c) => c.partido.id === partidoFiltro);
    }
    if (deptoFiltro !== "todos") {
      resultado = resultado.filter((c) => c.persona.departamento_origen === deptoFiltro);
    }
    if (busqueda.trim()) {
      const query = busqueda.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.persona.nombre_completo.toLowerCase().includes(query) ||
          c.persona.departamento_origen.toLowerCase().includes(query) ||
          c.partido.nombre.toLowerCase().includes(query)
      );
    }

    resultado.sort((a, b) => {
      switch (orden) {
        case "nombre":
          return a.persona.nombre_completo.localeCompare(b.persona.nombre_completo);
        case "score":
          return b.score.total - a.score.total;
        case "alertas":
          return b.alertas.length - a.alertas.length;
        case "departamento":
          return a.persona.departamento_origen.localeCompare(b.persona.departamento_origen);
        default:
          return 0;
      }
    });

    return resultado;
  }, [allCandidatos, tipoFiltro, partidoFiltro, deptoFiltro, busqueda, orden]);

  const totalPages = Math.ceil(candidatosFiltrados.length / PER_PAGE);
  const paginados = candidatosFiltrados.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => {
    const c = { todos: allCandidatos.length, presidencia: 0, senado: 0, camara: 0 };
    allCandidatos.forEach((cand) => {
      const t = cand.candidatura_actual.tipo as keyof typeof c;
      if (t in c) c[t]++;
    });
    return c;
  }, [allCandidatos]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 sm:text-4xl">
                Candidatos <span className="font-bold">2026</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                {allCandidatos.length.toLocaleString("es-CO")} candidatos inscritos — Datos oficiales Registraduria
                {diasParaElecciones > 0 && (
                  <span className="ml-2">
                    — <strong className="text-gray-900">{diasParaElecciones} dias</strong> para elecciones
                  </span>
                )}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c4e615] px-3 py-1.5 text-xs font-semibold text-gray-900">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-900 animate-pulse" />
              En vivo — Registraduria 2026
            </span>
          </div>

          {/* Pill tabs */}
          <div className="mt-6 inline-flex rounded-full bg-gray-100/70 p-1">
            {TIPO_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(setTipoFiltro)(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  tipoFiltro === tab.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                <span className={cn(tipoFiltro === tab.value ? "text-[#c4e615]" : "text-gray-400")}>
                  {tab.icon}
                </span>
                {tab.label}
                <span className={cn(
                  "ml-1 text-[11px]",
                  tipoFiltro === tab.value ? "text-gray-400" : "text-gray-400"
                )}>
                  {counts[tab.value].toLocaleString("es-CO")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters bar — floating like nav */}
      <div className="sticky top-[60px] z-30 px-4 py-2">
        <div className="mx-auto max-w-[1400px] rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-sm px-5 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              onSearch={handleFilterChange(setBusqueda)}
              placeholder="Buscar por nombre, departamento o partido..."
              size="sm"
              className="flex-1"
            />

            {/* Selects in a tinted container like nav pills */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100/70 p-1">
              <select
                value={deptoFiltro}
                onChange={(e) => handleFilterChange(setDeptoFiltro)(e.target.value)}
                className="rounded-xl bg-transparent px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="todos">Departamento</option>
                {departamentos.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={partidoFiltro}
                onChange={(e) => handleFilterChange(setPartidoFiltro)(e.target.value)}
                className="rounded-xl bg-transparent px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="todos">Partido</option>
                {partidos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>

              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as OrdenCampo)}
                className="rounded-xl bg-transparent px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="nombre">Nombre</option>
                <option value="departamento">Departamento</option>
                <option value="score">Score</option>
                <option value="alertas">Alertas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {candidatosFiltrados.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="mt-4 text-gray-500">No se encontraron candidatos con esos filtros.</p>
            <button
              onClick={() => {
                setBusqueda("");
                setTipoFiltro("todos");
                setPartidoFiltro("todos");
                setDeptoFiltro("todos");
                setPage(1);
              }}
              className="mt-3 text-sm font-medium text-gray-900 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Mostrando {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, candidatosFiltrados.length)} de{" "}
                {candidatosFiltrados.length.toLocaleString("es-CO")} candidatos
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-400">
                  Pagina {page} de {totalPages}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paginados.map((candidato) => (
                <CandidateCard key={candidato.persona.id} candidato={candidato} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="rounded-full border border-gray-200/60 bg-white px-3 py-2 text-sm disabled:opacity-30 hover:bg-gray-50"
                >
                  &laquo;
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full border border-gray-200/60 bg-white px-4 py-2 text-sm disabled:opacity-30 hover:bg-gray-50"
                >
                  Anterior
                </button>

                {getPageNumbers(page, totalPages).map((num, i) =>
                  num === -1 ? (
                    <span key={`e-${i}`} className="px-1.5 text-gray-400">...</span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={cn(
                        "rounded-full px-3.5 py-2 text-sm font-medium transition-all",
                        page === num
                          ? "bg-gray-900 text-white"
                          : "border border-gray-200/60 bg-white hover:bg-gray-50"
                      )}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-full border border-gray-200/60 bg-white px-4 py-2 text-sm disabled:opacity-30 hover:bg-gray-50"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="rounded-full border border-gray-200/60 bg-white px-3 py-2 text-sm disabled:opacity-30 hover:bg-gray-50"
                >
                  &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: number[] = [1];
  if (current > 3) pages.push(-1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push(-1);
  pages.push(total);
  return pages;
}
