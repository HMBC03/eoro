"use client";

import { useState } from "react";
import Link from "next/link";
import { getInitials } from "@/lib/utils";
import {
  formatCOP,
  formatCOPShort,
  formatDateCO,
  percentChange,
} from "@/lib/formatters";
import type { FuncionarioCompleto } from "@/lib/types";

const SECTIONS = [
  { id: "trayectoria", label: "Trayectoria" },
  { id: "patrimonio", label: "Patrimonio" },
  { id: "antecedentes", label: "Antecedentes" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const NIVEL_LABELS: Record<string, string> = {
  nacional: "Nacional",
  departamental: "Departamental",
  municipal: "Municipal",
};

interface HistorialDetailClientProps {
  funcionario: FuncionarioCompleto;
}

export default function HistorialDetailClient({ funcionario }: HistorialDetailClientProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("trayectoria");

  const { persona, cargo_actual, historial_cargos, declaraciones, antecedentes, vinculos } = funcionario;

  const antecedentesVigentes = antecedentes.filter((a) => a.estado === "vigente").length;
  const ultimaDeclaracion = declaraciones.length > 0 ? declaraciones[declaraciones.length - 1] : null;

  // Years of service
  const firstCargo = historial_cargos.reduce((earliest, c) => {
    return c.fecha_inicio < earliest ? c.fecha_inicio : earliest;
  }, historial_cargos[0]?.fecha_inicio ?? "2024-01-01");
  const yearsService = new Date().getFullYear() - new Date(firstCargo).getFullYear();

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/historial" className="hover:text-gray-700 transition-colors">
              Funcionarios
            </Link>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-700 font-medium truncate max-w-[250px]">
              {persona.nombre_completo}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ===== SIDEBAR ===== */}
          <aside className="w-full lg:w-80 shrink-0 space-y-4">
            {/* Profile card */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-600 text-lg font-bold text-white">
                  {getInitials(persona.nombre_completo)}
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">
                    {persona.nombre_completo}
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">{cargo_actual.cargo}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <InfoRow label="Entidad" value={cargo_actual.entidad} />
                <InfoRow label="Departamento" value={cargo_actual.departamento} />
                <InfoRow label="Nivel" value={NIVEL_LABELS[cargo_actual.nivel] ?? cargo_actual.nivel} />
                <InfoRow label="Desde" value={formatDateCO(cargo_actual.fecha_inicio)} />
                <InfoRow label="Servicio publico" value={`${yearsService} anos`} />
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {antecedentesVigentes > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3e2] px-2 py-0.5 text-[10px] font-medium text-[#d35400]">
                    <span className="h-1 w-1 rounded-full bg-[#f39c12]" />
                    {antecedentesVigentes} antecedente{antecedentesVigentes > 1 ? "s" : ""} vigente{antecedentesVigentes > 1 ? "s" : ""}
                  </span>
                )}
                {vinculos.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700">
                    {vinculos.length} vinculo{vinculos.length > 1 ? "s" : ""} familiar{vinculos.length > 1 ? "es" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Quick patrimonio */}
            {ultimaDeclaracion && (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Patrimonio {ultimaDeclaracion.anio}
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCOPShort(ultimaDeclaracion.patrimonio_total)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Ingresos: {formatCOPShort(ultimaDeclaracion.ingresos_total)}
                </p>
                {declaraciones.length >= 2 && (
                  <p className="text-xs mt-2 text-gray-500">
                    vs {declaraciones[declaraciones.length - 2].anio}:{" "}
                    <span className="font-semibold">
                      {percentChange(
                        declaraciones[declaraciones.length - 2].patrimonio_total,
                        ultimaDeclaracion.patrimonio_total
                      )}
                    </span>
                  </p>
                )}
              </div>
            )}
          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <main className="flex-1 min-w-0">
            {/* Section tabs */}
            <div className="flex gap-1 mb-6 rounded-xl bg-white border border-gray-100 shadow-sm p-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeSection === sec.id
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Trayectoria */}
            {activeSection === "trayectoria" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Trayectoria en el Estado</h2>
                <div className="space-y-0">
                  {historial_cargos.map((cargo, i) => (
                    <div key={cargo.id} className="relative flex gap-4 pb-6">
                      {/* Timeline line */}
                      {i < historial_cargos.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200" />
                      )}
                      {/* Dot */}
                      <div className={`relative z-10 mt-1.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${
                        cargo.fecha_fin === null
                          ? "bg-gray-900"
                          : "bg-white border-2 border-gray-300"
                      }`}>
                        {cargo.fecha_fin === null ? (
                          <span className="h-2 w-2 rounded-full bg-[#c4e615]" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{cargo.cargo}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{cargo.entidad}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            cargo.fecha_fin === null
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {cargo.fecha_fin === null ? "Actual" : "Finalizado"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span>{formatDateCO(cargo.fecha_inicio)}</span>
                          {cargo.fecha_fin && (
                            <>
                              <span>—</span>
                              <span>{formatDateCO(cargo.fecha_fin)}</span>
                            </>
                          )}
                          <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500">
                            {NIVEL_LABELS[cargo.nivel] ?? cargo.nivel}
                          </span>
                          <span>{cargo.departamento}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Patrimonio */}
            {activeSection === "patrimonio" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Evolucion Patrimonial</h2>
                {declaraciones.length > 0 ? (
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                          <th className="px-5 py-3">Ano</th>
                          <th className="px-5 py-3 text-right">Patrimonio</th>
                          <th className="px-5 py-3 text-right">Ingresos</th>
                          <th className="px-5 py-3 text-right">Inmuebles</th>
                          <th className="px-5 py-3 text-right">Vehiculos</th>
                          <th className="px-5 py-3 text-right">Cuentas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {declaraciones.map((d, i) => (
                          <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-5 py-3 font-bold text-gray-900">
                              {d.anio}
                              {i > 0 && (
                                <span className="ml-2 text-xs font-normal text-gray-400">
                                  {percentChange(declaraciones[i - 1].patrimonio_total, d.patrimonio_total)}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatCOP(d.patrimonio_total)}</td>
                            <td className="px-5 py-3 text-right text-gray-600">{formatCOPShort(d.ingresos_total)}</td>
                            <td className="px-5 py-3 text-right text-gray-600">{formatCOPShort(d.bienes_inmuebles_valor)}</td>
                            <td className="px-5 py-3 text-right text-gray-600">{formatCOPShort(d.vehiculos_valor)}</td>
                            <td className="px-5 py-3 text-right text-gray-600">{formatCOPShort(d.cuentas_bancarias_saldo)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center">
                    <p className="text-sm text-gray-400">No hay declaraciones patrimoniales registradas.</p>
                  </div>
                )}

                {/* Conflictos de interes */}
                {declaraciones.some((d) => d.conflictos_interes.length > 0) && (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                    <h3 className="text-sm font-bold text-amber-800 mb-2">Conflictos de interes reportados</h3>
                    <ul className="space-y-1">
                      {declaraciones.flatMap((d) =>
                        d.conflictos_interes.map((c, i) => (
                          <li key={`${d.id}-${i}`} className="text-xs text-amber-700">
                            {d.anio}: {c}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Antecedentes */}
            {activeSection === "antecedentes" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Antecedentes</h2>
                {antecedentes.length > 0 ? (
                  <div className="space-y-3">
                    {antecedentes.map((ant) => (
                      <div
                        key={ant.id}
                        className={`rounded-2xl border p-5 ${
                          ant.estado === "vigente"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-white border-gray-100 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                ant.tipo === "disciplinario"
                                  ? "bg-orange-100 text-orange-700"
                                  : ant.tipo === "fiscal"
                                    ? "bg-red-100 text-red-700"
                                    : ant.tipo === "penal"
                                      ? "bg-red-200 text-red-800"
                                      : "bg-purple-100 text-purple-700"
                              }`}>
                                {ant.tipo.charAt(0).toUpperCase() + ant.tipo.slice(1)}
                              </span>
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                ant.estado === "vigente"
                                  ? "bg-amber-200 text-amber-800"
                                  : ant.estado === "sancionado"
                                    ? "bg-red-100 text-red-700"
                                    : ant.estado === "absuelto"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                              }`}>
                                {ant.estado.charAt(0).toUpperCase() + ant.estado.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{ant.descripcion}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span>Reporta: {ant.entidad_reporta}</span>
                          <span>Fecha: {formatDateCO(ant.fecha_sancion)}</span>
                          <span>Fuente: {ant.fuente}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#e8f5e9] border border-green-200 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-green-800">Sin antecedentes registrados</p>
                    <p className="text-xs text-green-600 mt-1">
                      No se encontraron antecedentes disciplinarios, fiscales o penales en las fuentes consultadas.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-700 text-right max-w-[200px] truncate">{value}</span>
    </div>
  );
}
