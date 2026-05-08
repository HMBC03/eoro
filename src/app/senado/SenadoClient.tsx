"use client";

import { useState, useMemo, useCallback } from "react";
import { Senador, ComisionAPI } from "@/lib/types";
import { filterSenadores, fetchSenadores, fetchAsistencias, unificarSenadoresConAsistencias, relacionarSenadoresConComisiones } from "@/lib/data/senadores";
import { cn } from "@/lib/utils";
import { GlobalLoading } from "@/components/ui/GlobalLoading";

interface SenadoClientProps {
  initialSenadores: Senador[];
  partidos: string[];
  comisiones: ComisionAPI[];
  defaultStartAt: string;
  defaultEndAt: string;
}

function getPorcentajeColor(pct: number): { bg: string; text: string } {
  if (pct >= 90) return { bg: "bg-green-100", text: "text-green-700" };
  if (pct >= 60) return { bg: "bg-yellow-100", text: "text-yellow-700" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

function getComisionColor(index: number): string {
  const colors = [
    "blue-500",
    "green-500",
    "purple-500",
    "orange-500",
    "red-500",
    "cyan-500",
    "pink-500",
    "amber-500",
  ];
  return colors[index % colors.length];
}

export default function SenadoClient({
  initialSenadores,
  partidos,
  comisiones,
  defaultStartAt,
  defaultEndAt,
}: SenadoClientProps) {
  const [activeTab, setActiveTab] = useState<"comisiones" | "senadores">("comisiones");
  const [startAt, setStartAt] = useState(defaultStartAt);
  const [endAt, setEndAt] = useState(defaultEndAt);
  const [partido, setPartido] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [campoOrden, setCampoOrden] = useState<"name" | "porcentajeAsistencia" | "totalAsistencias">("name");
  const [ordenDir, setOrdenDir] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [senadores, setSenadores] = useState(initialSenadores);
  const [error, setError] = useState<string | null>(null);

  const handleActualizarFechas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [senadoresRaw, asimtas] = await Promise.all([
        fetchSenadores(),
        fetchAsistencias(startAt, endAt),
      ]);
      const conAsistencias = unificarSenadoresConAsistencias(senadoresRaw, asimtas);
      const actualizados = relacionarSenadoresConComisiones(conAsistencias, comisiones);
      setSenadores(actualizados);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  }, [startAt, endAt, comisiones]);

  const filteredSenadores = useMemo(() => {
    const filtered = filterSenadores(senadores, { partido, busqueda });

    return filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (campoOrden === "name") {
        aVal = a.name;
        bVal = b.name;
      } else if (campoOrden === "porcentajeAsistencia") {
        aVal = a.porcentajeAsistencia ?? 0;
        bVal = b.porcentajeAsistencia ?? 0;
      } else {
        aVal = a.totalAsistencias ?? 0;
        bVal = b.totalAsistencias ?? 0;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        const cmp = aVal.localeCompare(bVal);
        return ordenDir === "asc" ? cmp : -cmp;
      }

      const cmp = (aVal as number) < (bVal as number) ? -1 : (aVal as number) > (bVal as number) ? 1 : 0;
      return ordenDir === "asc" ? cmp : -cmp;
    });
  }, [senadores, partido, busqueda, campoOrden, ordenDir]);

  const handleOrdenar = (campo: "name" | "porcentajeAsistencia" | "totalAsistencias") => {
    if (campoOrden === campo) {
      setOrdenDir(ordenDir === "asc" ? "desc" : "asc");
    } else {
      setCampoOrden(campo);
      setOrdenDir("asc");
    }
  };

  return (
    <div className="relative">
      {isLoading && <GlobalLoading />}
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Senado de la República</h1>
        <p className="text-gray-600">
          Comisiones y senadors del Senado de Colombia.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="inline-flex rounded-full bg-gray-100/70 p-1">
          <button
            onClick={() => setActiveTab("comisiones")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              activeTab === "comisiones"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Comisiones
          </button>
          <button
            onClick={() => setActiveTab("senadores")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              activeTab === "senadores"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Senadores
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      {activeTab === "comisiones" && (() => {
        const esConstitucional = (id: number) => id >= 1 && id <= 7;
        
        let ultimoGrupo = "";
        
        return (
          <div className="space-y-4">
            {comisiones.map((comision, index) => {
              const senadorsEnComision = initialSenadores.filter(
                (s) => s.commission_id === comision.id.toString()
              );
              const colorClass = getComisionColor(index);
              const grupoActual = esConstitucional(comision.id) ? "Comisiones Constitucionales" : "Otras Comisiones";
              
              const mostrarDivider = ultimoGrupo !== "" && ultimoGrupo !== grupoActual;
              ultimoGrupo = grupoActual;
              
              return (
                <div key={comision.id}>
                  {mostrarDivider && (
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {grupoActual}
                      </span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                  )}
                  {index === 0 && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {grupoActual}
                      </span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                  )}
                  <div
                    className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden flex"
                  >
                    {/* Borde izquierdo colorido */}
                    <div className={cn("w-1 flex-shrink-0", `bg-${colorClass}`)} />
                    
                    {/* 40% Izquierda - Nombre e ID */}
                    <div className="w-2/5 px-5 py-4 bg-gray-50 flex flex-col justify-center">
                      <p className="text-xs text-gray-400 mb-1">Comisión #{comision.id}</p>
                      <h3 className="font-semibold text-lg leading-tight text-gray-900">{comision.name}</h3>
                      <p className="text-xs text-gray-500 mt-2">{senadorsEnComision.length} senators</p>
                    </div>
                    
                    {/* 60% Derecha - Propósito y Senadores */}
                    <div className="w-3/5 p-4 flex flex-col">
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Propósito</p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {comision.description?.split("\n")[0] || "Ver detalles en el Senado"}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Senadores que la integran</p>
                        <div className="flex flex-wrap gap-1">
                          {senadorsEnComision.map((s) => (
                            <a
                              key={s.id}
                              href={`/senado/${s.id}`}
                              className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              {s.name.split(" ").slice(0, 2).join(" ")}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {activeTab === "senadores" && (
        <>
          <div className="mb-6">
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Período SENADO 2022-2026 (20 jul 2022 - 19 jul 2026). Total sesiones: {senadores[0]?.totalSesiones ?? 0}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input
                type="date"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input
                type="date"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
              />
            </div>
            <button
              onClick={handleActualizarFechas}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Cargando..." : "Actualizar"}
            </button>

            <select
              value={partido}
              onChange={(e) => setPartido(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">Todos los partidos</option>
              {partidos.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white min-w-[200px]"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOrdenar("name")}
                    >
                      Nombre {campoOrden === "name" && (ordenDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Partido
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Comisión
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOrdenar("totalAsistencias")}
                    >
                      Asistencias {campoOrden === "totalAsistencias" && (ordenDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOrdenar("porcentajeAsistencia")}
                    >
                      % Asistencia {campoOrden === "porcentajeAsistencia" && (ordenDir === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSenadores.map((senador) => {
                    const pct = senador.porcentajeAsistencia ?? 0;
                    const colors = getPorcentajeColor(pct);
                    
                    return (
                      <tr key={senador.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">
                          <a href={`/senado/${senador.id}`} className="hover:text-blue-600 hover:underline">
                            {senador.name}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {senador.party_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {senador.comisionNombre || "Sin comisión"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {senador.totalAsistencias ?? 0} / {senador.totalSesiones ?? 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredSenadores.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No se encontraron senadores con los filtros seleccionados.
              </div>
            )}

            <div className="px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
              Mostrando {filteredSenadores.length} de {senadores.length} senadors
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
}