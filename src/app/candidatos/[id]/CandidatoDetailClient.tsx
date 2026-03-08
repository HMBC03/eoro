"use client";

import { useState } from "react";
import Link from "next/link";
import { DynastyGraphCard } from "@/components/graphs/DynastyGraphCard";
import { Badge } from "@/components/ui/Badge";
import { cn, getInitials, getEoroScoreColor, getEoroScoreBg, getEoroScoreLabel } from "@/lib/utils";
import {
  formatCOP,
  formatCOPShort,
  formatDateCO,
  formatDateShort,
  calculateAge,
  percentChange,
} from "@/lib/formatters";
import type { CandidatoCompleto, EoroHistorial, EoroEvaluacion } from "@/lib/types";
import type { DynastyData } from "@/lib/data/dynasty";
import { EoroScoreCard } from "@/components/candidates/EoroScoreCard";
import { EoroTimeline } from "@/components/candidates/EoroTimeline";

// ---- Familiar type for vinculos section ----
type FamiliarPersona = {
  id: string;
  nombre_completo: string;
  tipo: string;
  biografia: string;
};

// ---- Props interface ----
interface CandidatoDetailClientProps {
  candidato: CandidatoCompleto;
  dynastyData: DynastyData | null;
  familiarMap: Record<string, FamiliarPersona>;
  eoroHistorial?: EoroHistorial[];
  eoroEvaluaciones?: EoroEvaluacion[];
}

// ---- Section nav for scrollable detail area ----
const SECTIONS = [
  { id: "resumen", label: "Resumen" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "patrimonio", label: "Patrimonio" },
  { id: "antecedentes", label: "Antecedentes" },
  { id: "vinculos", label: "Vinculos" },
  { id: "financiacion", label: "Financiacion" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function CandidatoDetailClient({
  candidato,
  dynastyData,
  familiarMap,
  eoroHistorial = [],
  eoroEvaluaciones = [],
}: CandidatoDetailClientProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("resumen");
  const [showDynasty, setShowDynasty] = useState(false);

  const {
    persona,
    candidatura_actual,
    partido,
    historial_cargos,
    historial_candidaturas,
    declaraciones,
    antecedentes,
    vinculos,
    financiacion,
    alertas,
    score,
  } = candidato;

  const alertasAltas = alertas.filter((a) => a.severidad === "alta").length;
  const alertasMedia = alertas.filter((a) => a.severidad === "media").length;
  const ultimaDeclaracion = declaraciones.length > 0 ? declaraciones[declaraciones.length - 1] : null;
  const tipoLabel =
    candidatura_actual.tipo === "presidencia"
      ? "Presidencia"
      : candidatura_actual.tipo === "senado"
        ? "Senado"
        : "Camara";

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* ===== TOP BAR ===== */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/candidatos" className="hover:text-gray-700 transition-colors">
              Candidatos 2026
            </Link>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-700 font-medium">{persona.nombre_completo}</span>
          </nav>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: partido.color_hex }}
            >
              {getInitials(persona.nombre_completo)}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-700">{persona.nombre_completo}</p>
              <p className="text-xs text-gray-400">{partido.nombre}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* ===== GREETING + STATS ROW ===== */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-800 sm:text-4xl">
              {persona.nombre_completo}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: partido.color_hex }}
              >
                {partido.sigla} — {partido.nombre}
              </span>
              <span className="rounded-full bg-gray-200/80 px-3 py-1 text-xs font-medium text-gray-600">
                {tipoLabel} {candidatura_actual.tipo === "camara" && `— ${candidatura_actual.circunscripcion}`}
              </span>
              {persona.fecha_nacimiento && (
                <span className="text-sm text-gray-400">
                  {calculateAge(persona.fecha_nacimiento)} anos
                </span>
              )}
              {persona.departamento_origen && (
                <span className="text-sm text-gray-400">
                  {persona.departamento_origen}
                </span>
              )}
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex items-center gap-3">
            {(() => {
              const eoroTotal = candidato.eoro_score?.score_total;
              const displayScore = eoroTotal != null ? eoroTotal : (score.total > 0 ? score.total : null);
              const tierColor = displayScore != null
                ? (displayScore >= 70 ? "green" : displayScore >= 40 ? "amber" : "red")
                : "gray";
              return (
                <StatPill
                  value={displayScore != null ? String(displayScore) : "—"}
                  label={displayScore != null ? getEoroScoreLabel(displayScore) : "Score"}
                  color={tierColor as "green" | "amber" | "red" | "gray"}
                />
              );
            })()}
            <StatPill
              value={String(historial_candidaturas.length)}
              label="Candidaturas"
              color="blue"
            />
            <StatPill
              value={ultimaDeclaracion ? formatCOPShort(ultimaDeclaracion.patrimonio_total) : "N/D"}
              label="Patrimonio"
              color="purple"
            />
            <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white border border-gray-200/60 px-4 py-2.5 shadow-sm">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <svg className="h-6 w-6 rounded-full bg-gray-800 p-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ===== MAIN DASHBOARD GRID ===== */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* ---- LEFT SIDEBAR ---- */}
          <div className="space-y-5">
            {/* Quick info card */}
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Informacion del candidato
                </p>
              </div>

              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
                  style={{ backgroundColor: partido.color_hex }}
                >
                  {getInitials(persona.nombre_completo)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-800">
                    {persona.nombre_completo.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="text-xs text-gray-400">{tipoLabel} 2026</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                <InfoRow label="Partido" value={partido.nombre} />
                <InfoRow label="Corporacion" value={tipoLabel} />
                {candidatura_actual.circunscripcion && (
                  <InfoRow label="Circunscripcion" value={candidatura_actual.circunscripcion} />
                )}
                {persona.departamento_origen && (
                  <InfoRow label="Departamento" value={persona.departamento_origen} />
                )}
                {persona.fecha_nacimiento && (
                  <InfoRow label="Edad" value={`${calculateAge(persona.fecha_nacimiento)} anos`} />
                )}
                <InfoRow label="Estado" value={candidatura_actual.estado} />
                <InfoRow label="Cargos previos" value={String(historial_cargos.length)} />
              </div>

              {persona.biografia && (
                <p className="mt-4 text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
                  {persona.biografia}
                </p>
              )}

              {dynastyData && (
                <button
                  onClick={() => setShowDynasty(true)}
                  className="mt-4 w-full rounded-2xl bg-amber-50 hover:bg-amber-100 transition-colors p-3 text-left border border-amber-200/50"
                >
                  <p className="text-xs font-semibold text-amber-700">
                    Ver conexiones familiares politicas
                  </p>
                  <p className="text-[10px] text-amber-600/70 mt-0.5">
                    {dynastyData.nodes.length} personas en la red politica familiar
                  </p>
                </button>
              )}
            </div>

            {/* Score breakdown card */}
            {candidato.eoro_score ? (
              <EoroScoreCard score={candidato.eoro_score} />
            ) : (
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Eoro Score
                </p>
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-3xl font-light text-gray-300">—</p>
                  <p className="mt-1 text-xs text-gray-400">Sin evaluaciones registradas</p>
                </div>
              </div>
            )}

            {/* Eoro Timeline */}
            {eoroHistorial.length > 0 && (
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Historial Eoro
                </p>
                <EoroTimeline historial={eoroHistorial} />
              </div>
            )}

            {/* Section nav */}
            <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="space-y-1">
                {SECTIONS.map((section) => {
                  const count =
                    section.id === "antecedentes" ? antecedentes.length :
                    section.id === "vinculos" ? vinculos.length :
                    section.id === "trayectoria" ? historial_cargos.length :
                    null;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all",
                        activeSection === section.id
                          ? "bg-gray-900 text-white font-medium"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      )}
                    >
                      {section.label}
                      {count !== null && count > 0 && (
                        <span
                          className={cn(
                            "text-[10px] rounded-full px-2 py-0.5 font-medium",
                            activeSection === section.id
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ---- MAIN CONTENT AREA ---- */}
          <div className="space-y-6">
            {/* Notification cards row (alerts) */}
            {alertas.length > 0 && activeSection === "resumen" && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {alertas.slice(0, 3).map((alerta) => {
                  const colors = {
                    alta: { bg: "bg-[#fce4e4]", text: "text-[#c0392b]", accent: "#e74c3c" },
                    media: { bg: "bg-[#fef3e2]", text: "text-[#d35400]", accent: "#f39c12" },
                    baja: { bg: "bg-[#e8f5e9]", text: "text-[#27ae60]", accent: "#2ecc71" },
                  };
                  const c = colors[alerta.severidad];
                  return (
                    <div key={alerta.id} className={cn("rounded-3xl p-5 relative overflow-hidden", c.bg)}>
                      <div className="absolute -right-4 -bottom-4 text-7xl font-bold opacity-[0.07]">
                        !
                      </div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-2">
                        {alerta.severidad === "alta" ? "Requiere atencion" : "Notificacion"}
                      </p>
                      <p className={cn("text-sm font-medium leading-snug", c.text)}>
                        {alerta.titulo}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                        {alerta.descripcion}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Colored stat blocks */}
            {activeSection === "resumen" && (
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <DashboardStatCard
                  value={String(alertas.length)}
                  label="Alertas detectadas"
                  sublabel={alertasAltas > 0 ? `${alertasAltas} alta${alertasAltas > 1 ? "s" : ""}` : undefined}
                  bg="bg-[#fce4e4]"
                  textColor="text-[#c0392b]"
                />
                <DashboardStatCard
                  value={String(historial_cargos.length)}
                  label="Cargos publicos"
                  sublabel={historial_cargos.length > 0 ? "En su trayectoria" : undefined}
                  bg="bg-[#e8f0fe]"
                  textColor="text-[#1a56db]"
                />
                <DashboardStatCard
                  value={String(vinculos.length)}
                  label="Vinculos familiares"
                  sublabel={vinculos.length > 0 ? "En sector publico" : undefined}
                  bg="bg-[#fef3e2]"
                  textColor="text-[#d35400]"
                />
                <DashboardStatCard
                  value={String(declaraciones.length)}
                  label="Declaraciones"
                  sublabel={declaraciones.length > 0 ? "Bienes y rentas" : undefined}
                  bg="bg-[#e8f5e9]"
                  textColor="text-[#27ae60]"
                />
              </div>
            )}

            {/* ---- RESUMEN section ---- */}
            {activeSection === "resumen" && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Historial electoral</h2>
                    <p className="text-xs text-gray-400">{historial_candidaturas.length} candidatura{historial_candidaturas.length !== 1 ? "s" : ""} registrada{historial_candidaturas.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                {historial_candidaturas.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">Primera candidatura registrada.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                          <th className="pb-3 font-medium">Ano</th>
                          <th className="pb-3 font-medium">Cargo</th>
                          <th className="pb-3 font-medium">Circunscripcion</th>
                          <th className="pb-3 font-medium">Votos</th>
                          <th className="pb-3 font-medium">Resultado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...historial_candidaturas]
                          .sort((a, b) => b.eleccion_year - a.eleccion_year)
                          .map((cand) => (
                            <tr key={cand.id} className="border-b border-gray-50 last:border-0">
                              <td className="py-3 text-sm font-medium text-gray-700">{cand.eleccion_year}</td>
                              <td className="py-3 text-sm text-gray-600 capitalize">{cand.tipo}</td>
                              <td className="py-3 text-sm text-gray-500">{cand.circunscripcion}</td>
                              <td className="py-3 text-sm text-gray-500">{cand.votos_obtenidos?.toLocaleString("es-CO") ?? "—"}</td>
                              <td className="py-3">
                                <StatusDot
                                  status={cand.elegido ? "success" : cand.estado === "inscrito" ? "info" : "neutral"}
                                  label={cand.elegido ? "Electo" : cand.estado === "inscrito" ? "Inscrito" : cand.estado}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ---- TRAYECTORIA section ---- */}
            {activeSection === "trayectoria" && (
              <div className="space-y-5">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Cargos publicos
                  </h2>
                  {historial_cargos.length === 0 ? (
                    <EmptyState message="No se registran cargos publicos previos." />
                  ) : (
                    <div className="space-y-4">
                      {[...historial_cargos]
                        .sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))
                        .map((cargo, i) => (
                          <div key={cargo.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={cn(
                                "h-3 w-3 rounded-full border-2 shrink-0 mt-1.5",
                                i === 0 ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"
                              )} />
                              {i < historial_cargos.length - 1 && (
                                <div className="w-px flex-1 bg-gray-200 my-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-medium text-gray-800">{cargo.cargo}</p>
                                  <p className="text-sm text-gray-500">{cargo.entidad}</p>
                                  <p className="mt-0.5 text-xs text-gray-400">
                                    {cargo.departamento}{cargo.nivel !== "nacional" && ` — ${cargo.municipio}`}
                                  </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                                  {formatDateShort(cargo.fecha_inicio)} — {cargo.fecha_fin ? formatDateShort(cargo.fecha_fin) : "Actual"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Historial electoral
                  </h2>
                  {historial_candidaturas.length === 0 ? (
                    <EmptyState message="Primera candidatura." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                            <th className="pb-3 font-medium">Ano</th>
                            <th className="pb-3 font-medium">Cargo</th>
                            <th className="pb-3 font-medium">Circunscripcion</th>
                            <th className="pb-3 font-medium">Votos</th>
                            <th className="pb-3 font-medium">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...historial_candidaturas]
                            .sort((a, b) => b.eleccion_year - a.eleccion_year)
                            .map((cand) => (
                              <tr key={cand.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-3 text-sm font-medium text-gray-700">{cand.eleccion_year}</td>
                                <td className="py-3 text-sm text-gray-600 capitalize">{cand.tipo}</td>
                                <td className="py-3 text-sm text-gray-500">{cand.circunscripcion}</td>
                                <td className="py-3 text-sm text-gray-500">{cand.votos_obtenidos?.toLocaleString("es-CO") ?? "—"}</td>
                                <td className="py-3">
                                  <StatusDot
                                    status={cand.elegido ? "success" : cand.estado === "inscrito" ? "info" : "neutral"}
                                    label={cand.elegido ? "Electo" : cand.estado === "inscrito" ? "Inscrito" : cand.estado}
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---- PATRIMONIO section ---- */}
            {activeSection === "patrimonio" && (
              <div className="space-y-5">
                {declaraciones.length === 0 ? (
                  <div className="rounded-3xl bg-[#fef3e2] p-6">
                    <p className="text-sm font-medium text-[#d35400]">
                      Este candidato no tiene declaraciones de bienes y rentas registradas en el sistema Ley 2013.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Evolucion patrimonial
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                              <th className="pb-3 font-medium">Ano</th>
                              <th className="pb-3 font-medium text-right">Patrimonio</th>
                              <th className="pb-3 font-medium text-right">Ingresos</th>
                              <th className="pb-3 font-medium text-right">Inmuebles</th>
                              <th className="pb-3 font-medium text-right">Vehiculos</th>
                              <th className="pb-3 font-medium text-right">Cambio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...declaraciones]
                              .sort((a, b) => a.anio - b.anio)
                              .map((dec, i, arr) => {
                                const prev = i > 0 ? arr[i - 1] : null;
                                const cambio = prev
                                  ? percentChange(prev.patrimonio_total, dec.patrimonio_total)
                                  : "—";
                                const cambioNum = prev
                                  ? ((dec.patrimonio_total - prev.patrimonio_total) / prev.patrimonio_total) * 100
                                  : 0;
                                return (
                                  <tr key={dec.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3 text-sm font-medium text-gray-700">{dec.anio}</td>
                                    <td className="py-3 text-sm text-right font-medium text-gray-700">{formatCOPShort(dec.patrimonio_total)}</td>
                                    <td className="py-3 text-sm text-right text-gray-500">{formatCOPShort(dec.ingresos_total)}</td>
                                    <td className="py-3 text-sm text-right text-gray-500">{formatCOPShort(dec.bienes_inmuebles_valor)}</td>
                                    <td className="py-3 text-sm text-right text-gray-500">{formatCOPShort(dec.vehiculos_valor)}</td>
                                    <td className={cn(
                                      "py-3 text-sm text-right font-medium",
                                      cambioNum > 100 ? "text-red-500" : cambioNum > 50 ? "text-amber-500" : "text-emerald-500"
                                    )}>
                                      {cambio}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {declaraciones.some((d) => d.conflictos_interes.length > 0) && (
                      <div className="rounded-3xl bg-[#fef3e2] p-6">
                        <h3 className="text-sm font-semibold text-[#d35400] mb-3">
                          Conflictos de interes declarados
                        </h3>
                        <div className="space-y-2">
                          {declaraciones
                            .flatMap((d) => d.conflictos_interes.map((c) => ({ anio: d.anio, conflicto: c })))
                            .map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-medium text-[#d35400]">
                                  {item.anio}
                                </span>
                                <span className="text-gray-600">{item.conflicto}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ---- ANTECEDENTES section ---- */}
            {activeSection === "antecedentes" && (
              <div className="space-y-4">
                {antecedentes.length === 0 ? (
                  <div className="rounded-3xl bg-[#e8f5e9] p-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/60">
                      <svg className="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-emerald-700">Sin antecedentes registrados</p>
                      <p className="text-sm text-gray-500">
                        No se encontraron antecedentes disciplinarios, fiscales ni penales.
                      </p>
                    </div>
                  </div>
                ) : (
                  antecedentes.map((ant) => {
                    const estadoConfig: Record<string, { bg: string; text: string; dot: string }> = {
                      vigente: { bg: "bg-[#fce4e4]", text: "text-[#c0392b]", dot: "bg-red-500" },
                      sancionado: { bg: "bg-[#fef3e2]", text: "text-[#d35400]", dot: "bg-amber-500" },
                      archivado: { bg: "bg-white", text: "text-gray-600", dot: "bg-gray-400" },
                      absuelto: { bg: "bg-[#e8f5e9]", text: "text-emerald-700", dot: "bg-emerald-500" },
                    };
                    const cfg = estadoConfig[ant.estado] ?? estadoConfig.archivado;
                    return (
                      <div key={ant.id} className={cn("rounded-3xl p-6 border border-gray-100", cfg.bg)}>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusDot
                            status={ant.estado === "vigente" ? "danger" : ant.estado === "sancionado" ? "warning" : ant.estado === "absuelto" ? "success" : "neutral"}
                            label={ant.estado.charAt(0).toUpperCase() + ant.estado.slice(1)}
                          />
                          <span className="rounded-full bg-gray-200/60 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                            {ant.tipo}
                          </span>
                        </div>
                        <p className={cn("text-sm font-medium", cfg.text)}>{ant.descripcion}</p>
                        <p className="mt-2 text-xs text-gray-400">
                          {ant.entidad_reporta} — {formatDateCO(ant.fecha_sancion)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ---- VINCULOS section ---- */}
            {activeSection === "vinculos" && (
              <div className="space-y-4">
                {vinculos.length === 0 ? (
                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                    <EmptyState message="No se han detectado vinculos familiares con otros funcionarios publicos o contratistas." />
                  </div>
                ) : (
                  vinculos.map((v) => {
                    const otroId = v.persona_a_id === persona.id ? v.persona_b_id : v.persona_a_id;
                    const familiar = familiarMap[otroId];
                    return (
                      <div key={v.id} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-sm font-bold">
                            {familiar ? getInitials(familiar.nombre_completo) : "?"}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {familiar?.nombre_completo ?? "Persona no identificada"}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                {v.parentesco}
                              </span>
                              {familiar && (
                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                                  {familiar.tipo}
                                </span>
                              )}
                              <StatusDot
                                status={v.verificado ? "danger" : "neutral"}
                                label={v.verificado ? "Verificado" : "Sin verificar"}
                              />
                            </div>
                            {familiar?.biografia && (
                              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                                {familiar.biografia}
                              </p>
                            )}
                            <p className="mt-1 text-[11px] text-gray-300">
                              {v.fuente} — {formatDateCO(v.fecha_deteccion)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ---- FINANCIACION section ---- */}
            {activeSection === "financiacion" && (
              <div className="space-y-5">
                {financiacion.length === 0 ? (
                  <div className="rounded-3xl bg-[#fce4e4] p-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/60">
                      <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-red-700">No ha reportado financiacion de campana</p>
                      <p className="text-sm text-gray-500">
                        No ha presentado reporte de ingresos ni gastos en Cuentas Claras (CNE).
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Finance summary cards */}
                    <div className="grid grid-cols-3 gap-4">
                      <DashboardStatCard
                        value={formatCOPShort(financiacion.filter((f) => f.tipo === "ingreso").reduce((s, f) => s + f.valor, 0))}
                        label="Total ingresos"
                        bg="bg-[#e8f5e9]"
                        textColor="text-[#27ae60]"
                      />
                      <DashboardStatCard
                        value={formatCOPShort(financiacion.filter((f) => f.tipo === "gasto").reduce((s, f) => s + f.valor, 0))}
                        label="Total gastos"
                        bg="bg-[#fce4e4]"
                        textColor="text-[#c0392b]"
                      />
                      <DashboardStatCard
                        value={String(financiacion.filter((f) => f.tipo === "ingreso").length)}
                        label="Fuentes de ingreso"
                        bg="bg-[#e8f0fe]"
                        textColor="text-[#1a56db]"
                      />
                    </div>

                    {/* Finance table */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-800 mb-5">Detalle de financiacion</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                              <th className="pb-3 font-medium">Tipo</th>
                              <th className="pb-3 font-medium">Concepto</th>
                              <th className="pb-3 font-medium">Aportante</th>
                              <th className="pb-3 font-medium">Origen</th>
                              <th className="pb-3 font-medium text-right">Valor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {financiacion.map((f) => (
                              <tr key={f.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-3">
                                  <StatusDot
                                    status={f.tipo === "ingreso" ? "success" : "warning"}
                                    label={f.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                                  />
                                </td>
                                <td className="py-3 text-sm text-gray-600">{f.concepto}</td>
                                <td className="py-3 text-sm text-gray-500">{f.aportante_nombre || "—"}</td>
                                <td className="py-3">
                                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                    {f.aportante_tipo}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-right font-medium text-gray-700">{formatCOP(f.valor)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 text-[11px] text-gray-300">Fuente: Cuentas Claras — CNE</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynasty graph — full screen */}
      {showDynasty && dynastyData && (
        <DynastyGraphCard
          candidateName={persona.nombre_completo}
          nodes={dynastyData.nodes}
          edges={dynastyData.edges}
          onClose={() => setShowDynasty(false)}
        />
      )}
    </div>
  );
}

// ============================================================
// Sub-components (colocated — dashboard specific)
// ============================================================

function StatPill({ value, label, color }: { value: string; label: string; color: "green" | "amber" | "red" | "gray" | "blue" | "purple" }) {
  const colorMap = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    gray: "bg-gray-100 text-gray-500",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className="text-center">
      <p className={cn("text-2xl font-bold tabular-nums", colorMap[color].split(" ").pop())}>
        {value}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function DashboardStatCard({
  value,
  label,
  sublabel,
  bg,
  textColor,
}: {
  value: string;
  label: string;
  sublabel?: string;
  bg: string;
  textColor: string;
}) {
  return (
    <div className={cn("rounded-3xl p-5 relative overflow-hidden", bg)}>
      <p className={cn("text-3xl font-bold", textColor)}>{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
      {sublabel && <p className="mt-0.5 text-[10px] text-gray-400">{sublabel}</p>}
      <div className="absolute -right-2 -bottom-2">
        <svg className="h-10 w-10 opacity-[0.08]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

function StatusDot({
  status,
  label,
}: {
  status: "success" | "danger" | "warning" | "info" | "neutral";
  label: string;
}) {
  const colors = {
    success: "bg-emerald-500",
    danger: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    neutral: "bg-gray-400",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
      <span className={cn("h-1.5 w-1.5 rounded-full", colors[status])} />
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-700 capitalize">{value}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="mt-3 text-sm text-gray-400">{message}</p>
    </div>
  );
}
