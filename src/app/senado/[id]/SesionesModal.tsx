"use client";

import { useState } from "react";
import { SesionDetalle } from "@/lib/types";

interface Props {
  sesiones: SesionDetalle[];
}

export default function SesionesModal({ sesiones }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 bg-gray-50 text-sm text-blue-600 hover:bg-gray-100 font-medium border-t"
      >
        Ver más ({sesiones.length - 5} sesiones)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-900">
                Detalle de Sesiones ({sesiones.length} total)
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Fecha</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Estado</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Voto</th>
                  </tr>
                </thead>
                <tbody>
                  {sesiones.map((sesion) => (
                    <tr key={sesion.plenary_id} className="border-t">
                      <td className="px-3 py-2 text-gray-700">
                        {new Date(sesion.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-3 py-2">
                        <span className={
                          sesion.estado === "asistio_voto" ? "text-green-600 font-medium" :
                          sesion.estado === "asistio_sin_voto" ? "text-yellow-600 font-medium" : 
                          "text-red-600 font-medium"
                        }>
                          {sesion.estado === "asistio_voto" ? "Asistió y votó" : 
                           sesion.estado === "asistio_sin_voto" ? "Asistió sin votar" : "No asistió"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {sesion.voto ? sesion.voto.toUpperCase() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}