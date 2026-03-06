"use client";

import { useState, useMemo } from "react";
import { FuncionarioCard } from "@/components/history/FuncionarioCard";
import type { FuncionarioCompleto } from "@/lib/types";

interface HistorialClientProps {
  allFuncionarios: FuncionarioCompleto[];
}

const NIVEL_LABELS: Record<string, string> = {
  nacional: "Nacional",
  departamental: "Departamental",
  municipal: "Municipal",
};

const niveles = ["nacional", "departamental", "municipal"] as const;

export default function HistorialClient({ allFuncionarios }: HistorialClientProps) {
  const departamentos = useMemo(
    () => [...new Set(allFuncionarios.map((f) => f.cargo_actual.departamento))].sort(),
    [allFuncionarios]
  );
  const entidades = useMemo(
    () => [...new Set(allFuncionarios.map((f) => f.cargo_actual.entidad))].sort(),
    [allFuncionarios]
  );

  const [busqueda, setBusqueda] = useState("");
  const [departamento, setDepartamento] = useState("todos");
  const [entidad, setEntidad] = useState("todos");
  const [nivel, setNivel] = useState("todos");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const filtered = useMemo(() => {
    let arr = allFuncionarios;
    if (busqueda.length >= 2) {
      const q = busqueda.toLowerCase();
      arr = arr.filter(
        (f) =>
          f.persona.nombre_completo.toLowerCase().includes(q) ||
          f.cargo_actual.entidad.toLowerCase().includes(q) ||
          f.cargo_actual.cargo.toLowerCase().includes(q) ||
          f.cargo_actual.departamento.toLowerCase().includes(q)
      );
    }
    if (departamento !== "todos") arr = arr.filter((f) => f.cargo_actual.departamento === departamento);
    if (entidad !== "todos") arr = arr.filter((f) => f.cargo_actual.entidad === entidad);
    if (nivel !== "todos") arr = arr.filter((f) => f.cargo_actual.nivel === nivel);
    return arr;
  }, [allFuncionarios, busqueda, departamento, entidad, nivel]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function resetFilters() {
    setBusqueda("");
    setDepartamento("todos");
    setEntidad("todos");
    setNivel("todos");
    setPage(1);
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-light text-gray-900">
            Historial de <span className="font-bold">Funcionarios</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Busca la traza historica de cualquier funcionario publico de Colombia.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre, entidad, cargo o departamento..."
              className="w-full rounded-2xl bg-white border border-gray-200 py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 shadow-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={departamento}
            onChange={(e) => { setDepartamento(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="todos">Todos los departamentos</option>
            {departamentos.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={entidad}
            onChange={(e) => { setEntidad(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="todos">Todas las entidades</option>
            {entidades.map((ent) => (
              <option key={ent} value={ent}>{ent}</option>
            ))}
          </select>

          <select
            value={nivel}
            onChange={(e) => { setNivel(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="todos">Todos los niveles</option>
            {niveles.map((n) => (
              <option key={n} value={n}>{NIVEL_LABELS[n]}</option>
            ))}
          </select>

          {(busqueda || departamento !== "todos" || entidad !== "todos" || nivel !== "todos") && (
            <button
              onClick={resetFilters}
              className="rounded-xl px-3 py-2 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400">
          {filtered.length} funcionario{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((f) => (
              <FuncionarioCard key={f.persona.id} funcionario={f} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-sm text-gray-400">No se encontraron funcionarios con esos criterios.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl px-3 py-2 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  p === page
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl px-3 py-2 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
