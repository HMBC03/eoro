import { fetchSenadores, fetchAsistencias, fetchComisiones, fetchVotaciones, unificarSenadoresConAsistencias, relacionarSenadoresConComisiones, unificarSenadoresConVotaciones, analizarSesionesDetalle } from "@/lib/data/senadores";
import { Senador } from "@/lib/types";
import { notFound } from "next/navigation";
import SesionesModal from "./SesionesModal";

const COMMISSION_COLORS = ["blue-500","green-500","purple-500","orange-500","red-500","cyan-500","pink-500","amber-500"];
const SHADOW_HEX: Record<string, string> = {
  "blue-500":"#3b82f6","green-500":"#22c55e","purple-500":"#a855f7","orange-500":"#f97316",
  "red-500":"#ef4444","cyan-500":"#06b6d4","pink-500":"#ec4899","amber-500":"#f59e0b",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SenadoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const senatorId = parseInt(id, 10);
  
  const [senadoresRaw, asimtas, comisiones, votaciones] = await Promise.all([
    fetchSenadores(),
    fetchAsistencias("2022-07-20", "2026-07-19"),
    fetchComisiones(),
    fetchVotaciones("2022-07-20", "2026-07-19"),
  ]);

  const senatorsConAsistencias = unificarSenadoresConAsistencias(senadoresRaw, asimtas);
  const senatorsConComisiones = relacionarSenadoresConComisiones(senatorsConAsistencias, comisiones);
  const senatorsConVotaciones = unificarSenadoresConVotaciones(senatorsConComisiones, votaciones, asimtas);
  const Senate = analizarSesionesDetalle(senatorsConVotaciones, votaciones, asimtas);
  
  const miembro = Senate.find((s) => s.id === senatorId);
  
  if (!miembro) {
    notFound();
  }

  const comision = comisiones.find((c) => c.id.toString() === miembro.commission_id);
  const comisionIdx = comisiones.findIndex((c) => c.id === comision?.id);
  const comisionColorClass = COMMISSION_COLORS[Math.max(0, comisionIdx) % COMMISSION_COLORS.length];
  const shadowColor = SHADOW_HEX[comisionColorClass] ?? "#3b82f6";
  const asistenciaPct = miembro.porcentajeAsistencia ?? 0;
  const asists = miembro.totalAsistencias ?? 0;
  const total = miembro.totalSesiones ?? 0;
  const inasistencias = total - asists;

  const asistenciaDesdeIngresoPct = miembro.porcentajeDesdeIngreso ?? 0;
  const sesionesDesdeIngreso = miembro.sesionesDesdeIngreso ?? 0;
  const sesionesTotalesPeriodo = miembro.sesionesTotalesPeriodo ?? total;

  const votosSi = miembro.votosSi ?? 0;
  const votosNo = miembro.votosNo ?? 0;
  const abst = miembro.abstenciones ?? 0;
  const totalVotos = miembro.totalVotaciones ?? 0;
  const participacionVot = miembro.participacionVotaciones ?? 0;

  const sesionesDetalle = miembro.sesionesDetalle ?? [];
  const tieneInasistencias = sesionesDetalle.some(s => s.estado === "no_asistio");
  const tieneAlertas = miembro.alertas && miembro.alertas.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <a href="/senado" className="text-blue-600 hover:underline text-sm mb-4 inline-flex items-center gap-1">
          ← Volver al Senado
        </a>
      </div>

      {/* Card Principal - Estilo comisión */}
      <div
        className="rounded-none bg-white border border-black overflow-hidden flex mb-8"
        style={{ boxShadow: `5px 5px 0px 0px ${shadowColor}` }}
      >
        {/* 40% Izquierda - Foto y datos básicos */}
        <div className="w-2/5 p-6 bg-gray-50 flex flex-col items-center text-center">
          {miembro.image ? (
            <img 
              src={miembro.image} 
              alt={miembro.name}
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
              <span className="text-4xl text-gray-500">👤</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-900">{miembro.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{miembro.party_name}</p>
          {miembro.fechaInicio && (
            <p className="text-xs text-gray-400 mt-2">
              Senador desde: {new Date(miembro.fechaInicio).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          {miembro.comisionNombre && (
            <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-xs text-blue-700">
              {miembro.comisionNombre}
            </span>
          )}
          {miembro.seRetiro && (
            <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-xs text-orange-700">
              ⚠️ Se ha retirado en algunas sesiones
            </span>
          )}
        </div>
        
        {/* 60% Derecha - Información */}
        <div className="w-3/5 p-6">
          {/* Contacto */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contacto</h3>
            <div className="space-y-2 text-sm">
              {miembro.email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {miembro.email}
                </p>
              )}
              {miembro.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Teléfono:</span> {miembro.phone}
                </p>
              )}
              {miembro.web && (
                <p className="text-gray-600">
                  <span className="font-medium">Web:</span>{" "}
                  <a href={miembro.web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {miembro.web.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
              {(miembro.twitter || miembro.facebook) && (
                <div className="flex gap-3 mt-2">
                  {miembro.twitter && (
                    <span className="text-gray-400 text-xs">🐦 @{miembro.twitter}</span>
                  )}
                  {miembro.facebook && (
                    <span className="text-gray-400 text-xs">📘 {miembro.facebook}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Comisión */}
          {comision && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Comisión</h3>
              <p className="text-sm text-gray-600">{comision.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {comision.description?.split("\n")[0]}
              </p>
            </div>
          )}

          {/* Asistencia */}
          <div className="mb-8 space-y-6">
            {/* Gráfico 1: Período Legislativo */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Asistencia - Período Legislativo 2022-2026</h3>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 h-6 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-green-200 bar-striped"
                    style={{ width: `${asistenciaPct}%` }}
                  />
                  <div 
                    className="h-full bg-red-200 bar-striped"
                    style={{ width: `${100 - asistenciaPct}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700">{asistenciaPct}%</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-green-50">
                  <p className="text-xl font-bold text-black">{asists}</p>
                  <p className="text-xs text-black">Asistencias</p>
                </div>
                <div className="p-2 rounded-lg bg-red-50">
                  <p className="text-xl font-bold text-black">{inasistencias}</p>
                  <p className="text-xs text-black">Inasistencias</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-xl font-bold text-black">{sesionesTotalesPeriodo}</p>
                  <p className="text-xs text-black">Total Sesiones</p>
                </div>
              </div>
            </div>

            {/* Gráfico 2: Desde su primer asistencia */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Asistencia - Desde su primer asistencia 
                <span className="font-normal text-gray-500">
                  ({miembro.fechaInicio ? new Date(miembro.fechaInicio).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }) : "N/A"})
                </span>
              </h3>
              {miembro.inicioTardio ? (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                      Dato atípico
                    </span>
                  </div>
                  <p className="text-xs text-purple-700">
                    El senador asumió el cargo {Math.floor((new Date(miembro.fechaInicio || "2022-07-20").getTime() - new Date("2022-07-20").getTime()) / (365.25 * 24 * 60 * 60 * 1000))} años después del inicio del período legislativo
                  </p>
                </div>
              ) : null}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 h-6 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-green-200 bar-striped"
                    style={{ width: `${asistenciaDesdeIngresoPct}%` }}
                  />
                  <div className="h-full bg-red-200 bar-striped" style={{ width: `${100 - asistenciaDesdeIngresoPct}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-700">{asistenciaDesdeIngresoPct}%</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-green-50">
                  <p className="text-xl font-bold text-black">{asists}</p>
                  <p className="text-xs text-black">Asistencias</p>
                </div>
                <div className="p-2 rounded-lg bg-red-50">
                  <p className="text-xl font-bold text-black">{sesionesDesdeIngreso - asists}</p>
                  <p className="text-xs text-black">Inasistencias</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-xl font-bold text-black">{sesionesDesdeIngreso}</p>
                  <p className="text-xs text-black">Sesiones desde ingreso</p>
                </div>
              </div>
            </div>
            {tieneAlertas && (
              <div className="mt-3 p-2 bg-amber-100 text-amber-700 text-xs rounded">
                Alerta: 5+ sesiones consecutivas sin asistir
              </div>
            )}
          </div>

          {/* Votaciones */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Votaciones (Período 2022-2026)</h3>
            
            <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
              <p className="text-xs text-amber-800">
                <span className="font-medium">⚠ Advertencia:</span> El API oficial del Senado retorna datos de prueba mezclados con datos reales. Los porcentajes de votacion pueden no reflejar fielmente la actividad legislativa real. <a href="/senado" className="underline">Ver mas</a>
              </p>
            </div>
            
            {/* Gráfico de votaciones */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-6 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-green-200 bar-striped"
                  style={{ width: totalVotos > 0 ? `${(votosSi / totalVotos) * 100}%` : "0%" }}
                />
                <div 
                  className="h-full bg-red-200 bar-striped"
                  style={{ width: totalVotos > 0 ? `${(votosNo / totalVotos) * 100}%` : "0%" }}
                />
                <div 
                  className="h-full bg-gray-300 bar-striped"
                  style={{ width: totalVotos > 0 ? `${(abst / totalVotos) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700">{participacionVot}%</span>
            </div>

            {/* Leyenda y números */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2 rounded-lg bg-green-50">
                <p className="text-xl font-bold text-black">{votosSi}</p>
                <p className="text-xs text-black">Votos Si</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <p className="text-xl font-bold text-black">{votosNo}</p>
                <p className="text-xs text-black">Votos No</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <p className="text-xl font-bold text-black">{abst}</p>
                <p className="text-xs text-black">Abstenciones</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <p className="text-xl font-bold text-black">{totalVotos}</p>
                <p className="text-xs text-black">Total Votaciones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Detalle de Sesiones */}
        {sesionesDetalle.length > 0 && (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <h3 className="bg-gray-100 px-4 py-2 font-semibold text-sm">
              Detalle de Sesiones ({sesionesDetalle.length} total)
            </h3>
            
            {/* Banner informativo si hay inasistencias */}
            {tieneInasistencias && (
              <div className="bg-green-50 px-4 py-2 text-xs text-green-700 border-b">
                Nota: El senador pudo presentar una excusa válida pero el sistema no nos permite saber dicha información.
              </div>
            )}
            
            {/* Tabla de sesiones (máx 5) */}
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Fecha</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Voto</th>
                </tr>
              </thead>
              <tbody>
                {sesionesDetalle.slice(0, 5).map((sesion) => (
                  <tr key={sesion.plenary_id} className="border-t">
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(sesion.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-2">
                      <span className={
                        sesion.estado === "asistio_voto" ? "text-green-600 font-medium" :
                        sesion.estado === "asistio_sin_voto" ? "text-yellow-600 font-medium" : 
                        "text-red-600 font-medium"
                      }>
                        {sesion.estado === "asistio_voto" ? "Asistió y votó" : 
                         sesion.estado === "asistio_sin_voto" ? "Asistió sin votar" : "No asistió"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {sesion.voto ? sesion.voto.toUpperCase() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Botón Ver más */}
            {sesionesDetalle.length > 5 && (
              <SesionesModal sesiones={sesionesDetalle} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}