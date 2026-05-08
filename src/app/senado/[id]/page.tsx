import { fetchSenadores, fetchAsistencias, fetchComisiones, unificarSenadoresConAsistencias, relacionarSenadoresConComisiones } from "@/lib/data/senadores";
import { Senador } from "@/lib/types";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SenadoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const senadorId = parseInt(id, 10);
  
  const [senadoresRaw, asimtas, comisiones] = await Promise.all([
    fetchSenadores(),
    fetchAsistencias("2022-07-20", "2026-07-19"),
    fetchComisiones(),
  ]);

  const senadorsConAsistencias = unificarSenadoresConAsistencias(senadoresRaw, asimtas);
  const Senado = relacionarSenadoresConComisiones(senadorsConAsistencias, comisiones);
  
  const senador = Senado.find((s) => s.id === senadorId);
  
  if (!senador) {
    notFound();
  }

  const comision = comisiones.find((c) => c.id.toString() === senador.commission_id);
  const asistenciaPct = senador.porcentajeAsistencia ?? 0;
  const asists = senador.totalAsistencias ?? 0;
  const total = senador.totalSesiones ?? 0;
  const inasistencias = total - asists;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <a href="/senado" className="text-blue-600 hover:underline text-sm mb-4 inline-flex items-center gap-1">
          ← Volver al Senado
        </a>
      </div>

      {/* Card Principal - Estilo comisión */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden flex mb-8">
        {/* Borde izquierdo */}
        <div className="w-1 bg-blue-500" />
        
        {/* 40% Izquierda - Foto y datos básicos */}
        <div className="w-2/5 p-6 bg-gray-50 flex flex-col items-center text-center">
          {senador.image ? (
            <img 
              src={senador.image} 
              alt={senador.name}
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
              <span className="text-4xl text-gray-500">👤</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-900">{senador.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{senador.party_name}</p>
          {senador.comisionNombre && (
            <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-xs text-blue-700">
              {senador.comisionNombre}
            </span>
          )}
        </div>
        
        {/* 60% Derecha - Información */}
        <div className="w-3/5 p-6">
          {/* Contacto */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contacto</h3>
            <div className="space-y-2 text-sm">
              {senador.email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {senador.email}
                </p>
              )}
              {senador.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Teléfono:</span> {senador.phone}
                </p>
              )}
              {senador.web && (
                <p className="text-gray-600">
                  <span className="font-medium">Web:</span>{" "}
                  <a href={senador.web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {senador.web.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
              {(senador.twitter || senador.facebook) && (
                <div className="flex gap-3 mt-2">
                  {senador.twitter && (
                    <span className="text-gray-400 text-xs">🐦 @{senador.twitter}</span>
                  )}
                  {senador.facebook && (
                    <span className="text-gray-400 text-xs">📘 {senador.facebook}</span>
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
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Asistencia (Período 2022-2026)</h3>
            
            {/* Diagrama de asistencia */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-6 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${asistenciaPct}%` }}
                />
                <div 
                  className="h-full bg-red-400"
                  style={{ width: `${100 - asistenciaPct}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700">{asistenciaPct}%</span>
            </div>

            {/* Números */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-green-50">
                <p className="text-2xl font-bold text-green-600">{asists}</p>
                <p className="text-xs text-green-600">Asistencias</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <p className="text-2xl font-bold text-red-500">{inasistencias}</p>
                <p className="text-xs text-red-500">Inasistencias</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-gray-600">{total}</p>
                <p className="text-xs text-gray-500">Sesiones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}