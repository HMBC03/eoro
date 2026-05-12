"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Senador, ComisionAPI } from "@/lib/types";
import { filterSenadores, getDefaultDateRange } from "@/lib/data/senadores";
import { getCachedSenadores, loadSenadoresData, clearSenadoresCache, getCacheAge } from "@/lib/senado-cache";
import { cn } from "@/lib/utils";
import { LoadingProgress } from "@/components/senado/LoadingProgress";

type LoadingState = "idle" | "loading" | "error" | "ready";

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

const SHADOW_HEX: Record<string, string> = {
  "blue-500": "#3b82f6",
  "green-500": "#22c55e",
  "purple-500": "#a855f7",
  "orange-500": "#f97316",
  "red-500": "#ef4444",
  "cyan-500": "#06b6d4",
  "pink-500": "#ec4899",
  "amber-500": "#f59e0b",
};

export default function SenadoClient() {
  const { startAt, endAt } = getDefaultDateRange();

  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [loadStep, setLoadStep] = useState("");
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [senadores, setSenadores] = useState<Senador[]>([]);
  const [partidos, setPartidos] = useState<string[]>([]);
  const [comisiones, setComisiones] = useState<ComisionAPI[]>([]);
  const [totalSesiones, setTotalSesiones] = useState(0);

  const [activeTab, setActiveTab] = useState<"comisiones" | "senadores">("comisiones");
  const [partido, setPartido] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData(forceRefresh = false) {
    setLoadingState("loading");
    setError(null);
    setLoadProgress(0);
    setLoadStep("");

    if (forceRefresh) {
      clearSenadoresCache();
    }

    const cached = getCachedSenadores(startAt, endAt);
    if (cached) {
      setSenadores(cached.Senador);
      setPartidos(cached.partidos);
      setComisiones(cached.comisiones);
      setTotalSesiones(cached.totalSesiones);
      setLoadingState("ready");
      return;
    }

    try {
      const data = await loadSenadoresData(startAt, endAt, (step, progress) => {
        setLoadStep(step);
        setLoadProgress(progress);
      });
      setSenadores(data.Senador);
      setPartidos(data.partidos);
      setComisiones(data.comisiones);
      setTotalSesiones(data.totalSesiones);
      setLoadingState("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
      setLoadingState("error");
    }
  }

  async function handleActualizar() {
    await loadData(true);
  }

  const filteredSenadores = useMemo(() => {
    return filterSenadores(senadores, { partido, busqueda });
  }, [senadores, partido, busqueda]);

  if (loadingState === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingProgress step={loadStep} progress={loadProgress} />
      </div>
    );
  }

  if (loadingState === "error") {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="p-6 bg-red-50 border border-red-300 rounded-none max-w-md text-center shadow-[5px_5px_0px_0px_#ef4444]">
          <p className="text-lg font-bold text-red-700 mb-2">Error al cargar datos</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
        <button
          onClick={() => loadData(true)}
          className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (loadingState === "idle") {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingProgress step="Inicializando..." progress={0} />
      </div>
    );
  }

  const cacheAge = getCacheAge(startAt, endAt);

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Senado de la República</h1>
          <p className="text-gray-600">
            Comisiones y senadores del Senado de Colombia.
          </p>
          {cacheAge && (
            <p className="mt-1 text-xs text-gray-400">
              Datos cacheados {cacheAge}
            </p>
          )}
        </div>

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

        {activeTab === "comisiones" && (
          <ComisionesTab comisiones={comisiones} initialSenadores={senadores} />
        )}
        {activeTab === "senadores" && (
          <SenadoresTab
            filteredSenadores={filteredSenadores}
            allSenadores={senadores}
            partidos={partidos}
            partido={partido}
            busqueda={busqueda}
            error={error}
            totalSesiones={totalSesiones}
            comisiones={comisiones}
            onPartidoChange={setPartido}
            onBusquedaChange={setBusqueda}
            onActualizar={handleActualizar}
          />
        )}
      </div>
    </div>
  );
}

function ComisionesTab({ comisiones, initialSenadores }: { comisiones: ComisionAPI[]; initialSenadores: Senador[] }) {
  const esConstitucional = (id: number) => id >= 1 && id <= 7;
  let ultimoGrupo = "";

  return (
    <div className="space-y-6">
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
            {(mostrarDivider || index === 0) && (
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {grupoActual}
                </span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
            )}
            <div
              className="rounded-none bg-white border border-black overflow-hidden flex"
              style={{ boxShadow: `5px 5px 0px 0px ${SHADOW_HEX[colorClass]}` }}
            >
              <div className="w-2/5 px-5 py-4 bg-gray-50 flex flex-col justify-center">
                <p className="text-xs text-gray-400 mb-1">Comisión #{comision.id}</p>
                <h3 className="font-semibold text-lg leading-tight text-gray-900">{comision.name}</h3>
                <p className="text-xs text-gray-500 mt-2">{senadorsEnComision.length} senadores</p>
              </div>
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
}

function SenadoresTab({
  filteredSenadores,
  allSenadores,
  partidos,
  partido,
  busqueda,
  error,
  totalSesiones,
  comisiones,
  onPartidoChange,
  onBusquedaChange,
  onActualizar,
}: {
  filteredSenadores: Senador[];
  allSenadores: Senador[];
  partidos: string[];
  partido: string;
  busqueda: string;
  error: string | null;
  totalSesiones: number;
  comisiones: ComisionAPI[];
  onPartidoChange: (v: string) => void;
  onBusquedaChange: (v: string) => void;
  onActualizar: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Período SENADO 2022-2026 (20 jul 2022 - 19 jul 2026). Total sesiones: {totalSesiones}
          </p>
        </div>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-lg">
          <p className="text-sm text-amber-800 font-medium">Advertencia sobre datos de votaciones</p>
          <p className="text-xs text-amber-700 mt-1">
            El API oficial del Senado esta retornando datos de prueba mezclados con datos reales. Los porcentajes de votacion mostrados podrian no reflejar fielmente la actividad legislativa real.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <button
          onClick={onActualizar}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Actualizar datos
        </button>
        <select
          value={partido}
          onChange={(e) => onPartidoChange(e.target.value)}
          className="px-4 py-2 border border-black rounded-lg bg-white text-sm"
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
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="px-4 py-2 border border-black rounded-lg bg-white text-sm min-w-[200px]"
        />
      </div>

      {(() => {
        const partidoCounts = allSenadores.reduce((acc, s) => {
          const party = s.party_name || "Sin partido";
          if (!acc[party]) acc[party] = { count: 0, totalPct: 0 };
          acc[party].count++;
          acc[party].totalPct += s.porcentajeDesdeIngreso ?? s.porcentajeAsistencia ?? 0;
          return acc;
        }, {} as Record<string, { count: number; totalPct: number }>);

        const partidoList = Object.entries(partidoCounts)
          .map(([name, data]) => ({
            name,
            count: data.count,
            avgPct: Math.round(data.totalPct / data.count),
          }))
          .sort((a, b) => b.count - a.count);

        const maxCount = partidoList[0]?.count || 1;
        const barColors = ["#3b82f6","#22c55e","#a855f7","#f97316","#ef4444","#06b6d4","#ec4899","#f59e0b","#14b8a6","#84cc16","#e879f9","#38bdf8","#f43f5e","#a3e635"];

        return (
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="rounded-none bg-white border border-black p-5 shadow-[5px_5px_0px_0px_#000]">
              <h3 className="font-bold text-black text-sm mb-4 uppercase tracking-wide">Senadores por Partido</h3>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {partidoList.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-5 text-center shrink-0">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: barColors[i % barColors.length] }}
                      />
                    </div>
                    <span className="text-xs text-gray-700 truncate min-w-0 flex-1" title={p.name}>{p.name}</span>
                    <div className="w-full max-w-[120px] h-4 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                      <div
                        className="h-full rounded-sm transition-all"
                        style={{
                          width: `${(p.count / maxCount) * 100}%`,
                          backgroundColor: barColors[i % barColors.length],
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-800 shrink-0 w-4 text-right">{p.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Total: <span className="font-bold">{allSenadores.length}</span> senadores · <span className="font-bold">{partidoList.length}</span> partidos
              </div>
            </div>

            <div className="rounded-none bg-white border border-black p-5 shadow-[5px_5px_0px_0px_#000]">
              <h3 className="font-bold text-black text-sm mb-4 uppercase tracking-wide">Asistencia Promedio por Partido</h3>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {partidoList.sort((a, b) => b.avgPct - a.avgPct).map((p, i) => {
                  const pctColor = p.avgPct >= 90 ? "#22c55e" : p.avgPct >= 60 ? "#eab308" : "#ef4444";
                  const pctBg = p.avgPct >= 90 ? "bg-green-100 text-green-700" : p.avgPct >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
                  return (
                    <div key={p.name} className="flex items-center gap-2">
                      <div className="w-5 text-center shrink-0">
                        <span
                          className="inline-block w-3 h-3 rounded-sm"
                          style={{ backgroundColor: pctColor }}
                        />
                      </div>
                      <span className="text-xs text-gray-700 truncate min-w-0 flex-1" title={p.name}>{p.name}</span>
                      <div className="w-full max-w-[120px] h-4 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                        <div
                          className="h-full rounded-sm transition-all"
                          style={{ width: `${p.avgPct}%`, backgroundColor: pctColor }}
                        />
                      </div>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${pctBg}`}>
                        {p.avgPct}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Promedio general: <span className="font-bold">{Math.round(partidoList.reduce((s, p) => s + p.avgPct, 0) / partidoList.length)}%</span>
              </div>
            </div>
          </div>
        );
      })()}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSenadores.map((senador) => {
          const pct = Math.round(senador.porcentajeDesdeIngreso ?? senador.porcentajeAsistencia ?? 0);
          const colors = getPorcentajeColor(pct);
          const tieneAlertas = Boolean(senador.alertas && senador.alertas.length > 0);
          const comisionIdx = comisiones.findIndex(c => c.id.toString() === senador.commission_id);
          const comisionColor = getComisionColor(comisionIdx >= 0 ? comisionIdx : 0);
          const avatarBg = SHADOW_HEX[comisionColor] || "#6b7280";
          const initials = senador.name.split(" ").slice(0, 2).map(n => n[0] || "").join("").toUpperCase();
          const hasImage = Boolean(senador.image && !senador.image.includes("null") && !senador.image.includes("undefined") && !senador.image.includes("ninguna"));

          return (
            <a
              key={senador.id}
              href={`/senado/${senador.id}`}
              className="group rounded-none bg-white border border-black p-5 transition-all shadow-[5px_5px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                {hasImage ? (
                  <div className="flex h-10 w-10 shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={senador.image}
                      alt={senador.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: avatarBg }}
                  >
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-black text-sm leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
                    {senador.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-400 truncate">
                    {senador.party_name || "Sin partido"}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 border-t border-gray-100 pt-2">
                <span className="font-medium">Comisión:</span>{" "}
                {senador.comisionNombre || "Sin comisión"}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Asistencia</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct >= 90 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>
                  {senador.totalAsistencias ?? 0} / {senador.sesionesDesdeIngreso ?? senador.totalSesiones ?? 0}
                </span>
                <span className="font-medium text-gray-500">sesiones</span>
              </div>

              {(senador.inicioTardio || tieneAlertas) && (
                <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
                  {senador.inicioTardio && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                      Tardío
                    </span>
                  )}
                  {tieneAlertas && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Alerta
                    </span>
                  )}
                </div>
              )}
            </a>
          );
        })}
      </div>

      {filteredSenadores.length === 0 && (
        <div className="p-12 text-center text-gray-500 bg-white border border-black shadow-[5px_5px_0px_0px_#000]">
          <p className="text-lg font-semibold mb-2">Sin resultados</p>
          <p className="text-sm text-gray-400">No se encontraron senadores con los filtros seleccionados.</p>
        </div>
      )}

      <div className="mt-4 px-4 py-3 border border-black border-t-0 bg-gray-50 text-sm text-gray-600 font-medium shadow-[5px_5px_0px_0px_#000]">
        Mostrando {filteredSenadores.length} de {allSenadores.length} senadores
      </div>
    </div>
  );
}
