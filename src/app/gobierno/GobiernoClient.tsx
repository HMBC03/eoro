"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { formatCOP, formatCOPShort } from "@/lib/formatters";
import type { EntidadEstado, FuncionarioGobierno, ContratoConVotos, RamaGobierno } from "@/lib/types";

type Tab = "mapa" | "funcionarios" | "contratos" | "presupuesto";

const TABS: { value: Tab; label: string; icon: React.ReactNode }[] = [
  {
    value: "mapa",
    label: "Mapa",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    value: "funcionarios",
    label: "Funcionarios",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: "contratos",
    label: "Contratos",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    value: "presupuesto",
    label: "Presupuesto",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0-11V3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945a8 8 0 01-.745 4.785l-.45.433a5.5 5.5 0 007.182 7.182l.45-.433a8 8 0 01.745-4.785L21 16v-2a2 2 0 00-2-2h-1.945a8 8 0 01-.745-4.785l-.45-.433a5.5 5.5 0 00-7.182-7.182l.45.433A8 8 0 013.055 11z" />
      </svg>
    ),
  },
];

const CATEGORIAS = [
  { key: "recaudo", label: "Recaudo e Ingresos", color: "#10B981" },
  { key: "presupuesto", label: "Presupuesto y Ejecución", color: "#3B82F6" },
  { key: "contratacion", label: "Contratación Pública", color: "#8B5CF6" },
  { key: "control", label: "Órganos de Control", color: "#EF4444" },
  { key: "activos", label: "Gestión de Activos", color: "#F59E0B" },
  { key: "datos", label: "Datos Abiertos", color: "#06B6D4" },
];

const RAMAS_ESTADO = [
  { key: "ramas", label: "Ramas del Poder Público", desc: "Ejecutiva, Legislativa y Judicial. Los tres poderes que conforman el Estado colombiano según la Constitución de 1991." },
  { key: "autonomos", label: "Órganos Autónomos e Independientes", desc: "Banco de la República, Comisión Nacional del Servicio Civil, Corporaciones Autónomas Regionales, Entes Universitarios Autónomos y Autoridad Nacional de Televisión." },
  { key: "electoral", label: "Organización Electoral", desc: "Registraduría Nacional del Estado Civil y Consejo Nacional Electoral." },
  { key: "control", label: "Organismos de Control", desc: "Ministerio Público (Procuraduría General, Defensoría del Pueblo, Personerías) y Control Fiscal (Contraloría General, Auditoría General, Contralorías Territoriales)." },
  { key: "justicia", label: "Sistema Integral de Verdad, Justicia, Reparación y No Repetición", desc: "Tres mecanismos del Acuerdo de Paz: Jurisdicción Especial para la Paz (JEP), Comisión de la Verdad y Unidad de Búsqueda de Personas Desaparecidas (UBPD)." },
];

interface GobiernoClientProps {
  entidades: EntidadEstado[];
  funcionarios: FuncionarioGobierno[];
  contratos: ContratoConVotos[];
  presupuesto: RamaGobierno[];
}

export default function GobiernoClient({
  entidades,
  funcionarios,
  contratos,
  presupuesto,
}: GobiernoClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("mapa");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRama, setFiltroRama] = useState<string>("todos");

  const entidadesFiltradas = useMemo(() => {
    if (!busqueda.trim()) return entidades;
    const q = busqueda.toLowerCase();
    return entidades.filter(
      (e) =>
        e.nombre.toLowerCase().includes(q) ||
        e.sigla?.toLowerCase().includes(q) ||
        e.subcategoria?.toLowerCase().includes(q)
    );
  }, [entidades, busqueda]);

  const entidadesAgrupadas = useMemo(() => {
    const grupos: Record<string, EntidadEstado[]> = {};
    for (const cat of CATEGORIAS) {
      grupos[cat.key] = entidadesFiltradas.filter((e) => e.categoria === cat.key);
    }
    return grupos;
  }, [entidadesFiltradas]);

  const funcionariosFiltrados = useMemo(() => {
    let resultado = [...funcionarios];
    if (filtroRama !== "todos") {
      resultado = resultado.filter((f) => f.rama === filtroRama);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      resultado = resultado.filter(
        (f) =>
          f.persona.nombre_completo.toLowerCase().includes(q) ||
          f.cargo.toLowerCase().includes(q) ||
          f.entidad.toLowerCase().includes(q)
      );
    }
    return resultado;
  }, [funcionarios, filtroRama, busqueda]);

  const totalPGN = presupuesto.reduce((sum, r) => sum + r.presupuesto_total, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="text-3xl font-light text-gray-900 sm:text-4xl">
            Gobierno <span className="font-bold">Unificado</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Mapa de entidades del Estado, funcionarios, contratos y presupuesto
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[60px] z-30 px-6 pb-4">
        <div className="mx-auto max-w-[1400px]">
          <div className="inline-flex rounded-full bg-gray-100/70 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as Tab)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  activeTab === tab.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
              placeholder="Buscar entidades, funcionarios, contratos..."
              className="w-full h-12 rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* === CONTENIDO POR PESTAÑA === */}

      {/* TAB: MAPA (vista principal) */}
      {activeTab === "mapa" && (
        <div className="mx-auto max-w-[1400px] px-6 pb-12">
          {/* Estructura del Estado */}
          <section className="mb-10">
            <div className="flex flex-col gap-3">
              {RAMAS_ESTADO.map((rama) => (
                <div
                  key={rama.key}
                  className="rounded-none bg-white p-5 border border-black shadow-[5px_5px_0px_0px_#000]"
                >
                  <h3 className="font-bold text-black">{rama.label}</h3>
                  <p className="mt-1 text-sm text-gray-600">{rama.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB: FUNCIONARIOS */}
      {activeTab === "funcionarios" && (
        <div className="mx-auto max-w-[1400px] px-6 pb-12">
          <div className="mb-4 flex items-center gap-2">
            <select
              value={filtroRama}
              onChange={(e) => setFiltroRama(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
            >
              <option value="todos">Todas las ramas</option>
              <option value="ejecutivo">Ejecutivo</option>
              <option value="legislativo">Legislativo</option>
              <option value="judicial">Judicial</option>
              <option value="control">Control</option>
            </select>
            <span className="text-sm text-gray-400">
              {funcionariosFiltrados.length} funcionarios
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {funcionariosFiltrados.map((f) => (
              <div
                key={f.id}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 border border-gray-100 shadow-sm"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{
                    backgroundColor: f.partido?.color_hex || "#6B7280",
                  }}
                >
                  {getInitials(f.persona.nombre_completo)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {f.persona.nombre_completo}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{f.cargo}</p>
                  <p className="text-xs text-gray-400 truncate">{f.entidad}</p>
                  <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 capitalize">
                    {f.rama}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CONTRATOS */}
      {activeTab === "contratos" && (
        <div className="mx-auto max-w-[1400px] px-6 pb-12">
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-400">
            <span>{contratos.length} contratos</span>
            <span>
              Valor total:{" "}
              {formatCOP(contratos.reduce((s, c) => s + c.valor_contrato, 0))}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Entidad</th>
                  <th className="pb-3 font-medium">Contratista</th>
                  <th className="pb-3 font-medium">Objeto</th>
                  <th className="pb-3 font-medium text-right">Valor</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {contratos.slice(0, 100).map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-sm text-gray-600">{c.entidad_nombre}</td>
                    <td className="py-3 text-sm text-gray-600">{c.contratista_nombre}</td>
                    <td className="py-3 text-sm text-gray-500 max-w-xs truncate">
                      {c.objeto}
                    </td>
                    <td className="py-3 text-sm text-gray-700 text-right font-medium">
                      {formatCOPShort(c.valor_contrato)}
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                        {c.estado}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-400">{c.fecha_firma}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PRESUPUESTO */}
      {activeTab === "presupuesto" && (
        <div className="mx-auto max-w-[1400px] px-6 pb-12">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-50 px-5 py-3">
              <p className="text-2xl font-bold text-emerald-700">
                {formatCOP(totalPGN)}
              </p>
              <p className="text-xs text-emerald-600">Presupuesto General de la Nación</p>
            </div>
            <div className="rounded-2xl bg-blue-50 px-5 py-3">
              <p className="text-2xl font-bold text-blue-700">
                {presupuesto.length} ramas
              </p>
              <p className="text-xs text-blue-600">Ramas del poder público</p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {presupuesto.map((rama) => (
              <div
                key={rama.id}
                className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{rama.nombre}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCOP(rama.presupuesto_total)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-900"
                    style={{ width: `${rama.porcentaje_pgn}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  {rama.porcentaje_pgn}% del PGN · {rama.entidades.length} entidades
                </p>
                {rama.entidades.length > 0 && (
                  <div className="mt-4 border-t border-gray-50 pt-3">
                    <p className="mb-2 text-xs font-medium text-gray-400">
                      Entidades:
                    </p>
                    <div className="space-y-1">
                      {rama.entidades.slice(0, 5).map((e) => (
                        <div
                          key={e.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-600 truncate">{e.nombre}</span>
                          <span className="text-gray-400">
                            {e.porcentaje_ejecucion}%
                          </span>
                        </div>
                      ))}
                      {rama.entidades.length > 5 && (
                        <p className="text-xs text-gray-400">
                          +{rama.entidades.length - 5} más...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}