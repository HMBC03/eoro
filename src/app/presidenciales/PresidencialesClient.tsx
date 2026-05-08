"use client";

import { useState, useMemo } from "react";
import { PresidentialCard } from "@/components/candidates/PresidentialCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { ELECCIONES_PRESIDENCIA_2026 } from "@/lib/constants";
import { daysUntil } from "@/lib/formatters";
import type { CandidatoCompleto } from "@/lib/types";

type OrdenCampo = "nombre" | "score" | "alertas" | "partido";

interface PresidencialesClientProps {
  presidenciales: CandidatoCompleto[];
}

export default function PresidencialesClient({
  presidenciales,
}: PresidencialesClientProps) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<OrdenCampo>("nombre");

  const diasParaElecciones = daysUntil(ELECCIONES_PRESIDENCIA_2026);

  const presidencialesFiltrados = useMemo(() => {
    let resultado = [...presidenciales];

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
          return a.persona.nombre_completo.localeCompare(
            b.persona.nombre_completo
          );
        case "score":
          return b.score.total - a.score.total;
        case "alertas":
          return b.alertas.length - a.alertas.length;
        case "partido":
          return a.partido.nombre.localeCompare(b.partido.nombre);
        default:
          return 0;
      }
    });

    return resultado;
  }, [presidenciales, busqueda, orden]);

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 sm:text-4xl">
                Candidatos{" "}
                <span className="font-bold">Presidenciales 2026</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                {presidenciales.length.toLocaleString("es-CO")} candidatos
                presidenciales inscritos
                {diasParaElecciones > 0 && (
                  <span className="ml-2">
                    —{" "}
                    <strong className="text-gray-900">
                      {diasParaElecciones} dias
                    </strong>{" "}
                    para elecciones
                  </span>
                )}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c4e615] px-3 py-1.5 text-xs font-semibold text-gray-900">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-900 animate-pulse" />
              En vivo — Registraduria 2026
            </span>
          </div>
        </div>
      </div>

      <div className="sticky top-[60px] z-30 px-4 py-2">
        <div className="mx-auto max-w-[1400px] rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-sm px-5 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              onSearch={setBusqueda}
              placeholder="Buscar por nombre, departamento o partido..."
              size="sm"
              className="flex-1"
            />
            <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100/70 p-1">
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as OrdenCampo)}
                className="rounded-xl bg-transparent px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="nombre">Nombre</option>
                <option value="partido">Partido</option>
                <option value="score">Score</option>
                <option value="alertas">Alertas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {presidencialesFiltrados.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-gray-500">
              No se encontraron candidatos con esos filtros.
            </p>
            <button
              onClick={() => setBusqueda("")}
              className="mt-3 text-sm font-medium text-gray-900 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {presidencialesFiltrados.map((candidato) => (
              <PresidentialCard
                key={candidato.persona.id}
                candidato={candidato}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
