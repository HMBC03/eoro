"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SearchResults } from "./page";

interface Props {
  initialQuery: string;
  results: SearchResults;
}

export default function BuscarClient({ initialQuery, results }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const totalResults =
    results.personas.length +
    results.partidos.length +
    results.entidades.length +
    results.contratos.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-6">
        <div className="mx-auto max-w-[1000px]">
          <h1 className="text-3xl font-light text-gray-900">
            Buscar en <span className="font-bold">Eoro</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Busca personas, partidos, entidades y contratos en toda la plataforma
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre, cedula, partido, entidad, contrato..."
                className="w-full h-12 rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="h-12 rounded-2xl bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm transition-all"
            >
              Buscar
            </button>
          </form>

          {initialQuery && (
            <p className="mt-4 text-sm text-gray-400">
              {totalResults === 0
                ? `No se encontraron resultados para "${initialQuery}"`
                : `${totalResults} resultado${totalResults !== 1 ? "s" : ""} para "${initialQuery}"`}
            </p>
          )}
        </div>
      </div>

      {initialQuery && totalResults > 0 && (
        <div className="mx-auto max-w-[1000px] px-6 pb-12 space-y-8">
          {/* Personas */}
          {results.personas.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Personas ({results.personas.length})
              </h2>
              <div className="space-y-2">
                {results.personas.map((p) => (
                  <Link
                    key={p.id}
                    href={`/candidatos/${p.id}`}
                    className="flex items-center justify-between rounded-2xl bg-white border border-gray-100 px-5 py-3.5 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-500">
                        {p.nombre_completo.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.nombre_completo}</p>
                        <p className="text-[11px] text-gray-400">{p.departamento_origen}</p>
                      </div>
                    </div>
                    <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Partidos */}
          {results.partidos.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Partidos ({results.partidos.length})
              </h2>
              <div className="space-y-2">
                {results.partidos.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 px-5 py-3.5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                      {p.sigla.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.nombre}</p>
                      <p className="text-[11px] text-gray-400">{p.sigla}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Entidades */}
          {results.entidades.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Entidades ({results.entidades.length})
              </h2>
              <div className="space-y-2">
                {results.entidades.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 px-5 py-3.5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                      {e.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{e.nombre}</p>
                      <p className="text-[11px] text-gray-400">{e.tipo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contratos */}
          {results.contratos.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Contratos ({results.contratos.length})
              </h2>
              <div className="space-y-2">
                {results.contratos.map((c) => (
                  <Link
                    key={c.id}
                    href="/contratos"
                    className="block rounded-2xl bg-white border border-gray-100 px-5 py-3.5 hover:shadow-sm transition-shadow"
                  >
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{c.objeto}</p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                      <span>{c.contratista_nombre}</span>
                      <span>·</span>
                      <span>{c.entidad}</span>
                      {c.valor_total > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-medium text-gray-600">
                            ${c.valor_total.toLocaleString("es-CO")}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Empty state */}
      {!initialQuery && (
        <div className="mx-auto max-w-[1000px] px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="mt-4 text-gray-500">Escribe algo para buscar en toda la plataforma</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Petro", "Senado", "Ministerio de Hacienda", "Antioquia"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  router.push(`/buscar?q=${encodeURIComponent(s)}`);
                }}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
