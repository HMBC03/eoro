"use client";

import { useState, useMemo, useCallback } from "react";
import { Senador } from "@/lib/types";
import { filterSenadores, fetchSenadores, fetchAsistencias, unificarSenadoresConAsistencias } from "@/lib/data/senadores";

interface SenadoresClientProps {
  initialSenadores: Senador[];
  partidos: string[];
  defaultStartAt: string;
  defaultEndAt: string;
}

function getPorcentajeColor(pct: number): { bg: string; text: string } {
  if (pct >= 90) return { bg: "bg-green-100", text: "text-green-700" };
  if (pct >= 60) return { bg: "bg-yellow-100", text: "text-yellow-700" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

export default function SenadoresClient({
  initialSenadores,
  partidos,
  defaultStartAt,
  defaultEndAt,
}: SenadoresClientProps) {
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
      const actualizados = unificarSenadoresConAsistencias(senadoresRaw, asimtas);
      setSenadores(actualizados);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  }, [startAt, endAt]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Senadores de la República</h1>
        <p className="text-gray-600">
          Datos abiertos del Senado de Colombia. Información de partidos y asistencia a plenarias.
        </p>
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
                      {senador.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {senador.party_name}
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
          Mostrando {filteredSenadores.length} de {senadores.length} senadores
        </div>
      </div>
    </div>
  );
}