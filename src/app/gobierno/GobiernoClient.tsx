"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { FuncionarioGobierno } from "./page";

type Rama = "todos" | "ejecutivo" | "legislativo" | "judicial" | "control" | "electoral";

const RAMA_TABS: { value: Rama; label: string; icon: React.ReactNode }[] = [
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
    value: "ejecutivo",
    label: "Ejecutivo",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    value: "legislativo",
    label: "Legislativo",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3" />
      </svg>
    ),
  },
  {
    value: "judicial",
    label: "Judicial",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
  {
    value: "control",
    label: "Control",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const RAMA_COLORS: Record<string, string> = {
  ejecutivo: "bg-blue-50 text-blue-700",
  legislativo: "bg-purple-50 text-purple-700",
  judicial: "bg-amber-50 text-amber-700",
  control: "bg-emerald-50 text-emerald-700",
  electoral: "bg-rose-50 text-rose-700",
};

const RAMA_LABELS: Record<string, string> = {
  ejecutivo: "Rama Ejecutiva",
  legislativo: "Rama Legislativa",
  judicial: "Rama Judicial",
  control: "Organos de Control",
  electoral: "Organizacion Electoral",
};

export default function GobiernoClient({ funcionarios }: { funcionarios: FuncionarioGobierno[] }) {
  const [ramaFiltro, setRamaFiltro] = useState<Rama>("todos");
  const [busqueda, setBusqueda] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: funcionarios.length };
    funcionarios.forEach((f) => {
      c[f.rama] = (c[f.rama] ?? 0) + 1;
    });
    return c;
  }, [funcionarios]);

  const filtered = useMemo(() => {
    let result = [...funcionarios];
    if (ramaFiltro !== "todos") {
      result = result.filter((f) => f.rama === ramaFiltro);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter(
        (f) =>
          f.persona.nombre_completo.toLowerCase().includes(q) ||
          f.cargo.toLowerCase().includes(q) ||
          f.entidad.toLowerCase().includes(q)
      );
    }
    return result;
  }, [funcionarios, ramaFiltro, busqueda]);

  // Group by rama for display
  const grouped = useMemo(() => {
    const groups: Record<string, FuncionarioGobierno[]> = {};
    filtered.forEach((f) => {
      if (!groups[f.rama]) groups[f.rama] = [];
      groups[f.rama].push(f);
    });
    return groups;
  }, [filtered]);

  const ramaOrder = ["ejecutivo", "legislativo", "judicial", "control", "electoral"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 sm:text-4xl">
                Gobierno <span className="font-bold">Actual</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                {funcionarios.length} funcionarios en ejercicio — Ramas del poder publico
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c4e615] px-3 py-1.5 text-xs font-semibold text-gray-900">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-900 animate-pulse" />
              Periodo actual
            </span>
          </div>

          {/* Pill tabs */}
          <div className="mt-6 inline-flex flex-wrap rounded-full bg-gray-100/70 p-1">
            {RAMA_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setRamaFiltro(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  ramaFiltro === tab.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                <span className={cn(ramaFiltro === tab.value ? "text-[#c4e615]" : "text-gray-400")}>
                  {tab.icon}
                </span>
                {tab.label}
                {(counts[tab.value] ?? 0) > 0 && (
                  <span className="ml-1 text-[11px] text-gray-400">
                    {counts[tab.value]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="sticky top-[60px] z-30 px-4 py-2">
        <div className="mx-auto max-w-[1400px] rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-sm px-5 py-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, cargo o entidad..."
              className="h-9 w-full rounded-lg border border-gray-200/60 bg-gray-50/80 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="mt-4 text-gray-500">
              {funcionarios.length === 0
                ? "Aun no hay funcionarios registrados. Agregue cargos desde el panel de administracion con rama asignada y sin fecha de finalizacion."
                : "No se encontraron funcionarios con esos filtros."}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {ramaOrder.map((rama) => {
              const group = grouped[rama];
              if (!group || group.length === 0) return null;

              return (
                <section key={rama}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", RAMA_COLORS[rama])}>
                      {RAMA_LABELS[rama]}
                    </span>
                    <span className="text-xs text-gray-400">{group.length} funcionarios</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-2xl bg-white border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-base font-bold text-gray-500 shrink-0">
                            {f.persona.nombre_completo.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {f.persona.nombre_completo}
                            </p>
                            <p className="text-[12px] text-gray-500 mt-0.5 truncate">{f.cargo}</p>
                            <p className="text-[11px] text-gray-400 truncate">{f.entidad}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", RAMA_COLORS[f.rama])}>
                            {f.rama}
                          </span>
                          {f.partido && (
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{
                                backgroundColor: `${f.partido.color_hex}20`,
                                color: f.partido.color_hex,
                              }}
                            >
                              {f.partido.nombre}
                            </span>
                          )}
                          {f.persona.departamento_origen && (
                            <span className="text-[10px] text-gray-400">
                              {f.persona.departamento_origen}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
