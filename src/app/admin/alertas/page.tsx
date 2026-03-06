import { createClient } from "@/lib/supabase/server";
import { toggleAlertaVerificada, deleteAlerta } from "../actions";

export default async function AdminAlertasPage() {
  const supabase = await createClient();
  const { data: alertas } = await supabase
    .schema("eoro")
    .from("alertas")
    .select("id, tipo, severidad, descripcion, verificada, detectada_at, persona_id, personas!inner(nombre_completo)")
    .order("detectada_at", { ascending: false });

  const rows = alertas ?? [];

  const SEVERIDAD_STYLES: Record<string, string> = {
    alta: "bg-red-50 text-red-700",
    media: "bg-amber-50 text-amber-700",
    baja: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
        <p className="text-sm text-gray-400 mt-1">{rows.length} alertas registradas</p>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
              <th className="px-5 py-3">Persona</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Severidad</th>
              <th className="px-5 py-3">Descripcion</th>
              <th className="px-5 py-3">Verificada</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const personaNombre = (a.personas as unknown as { nombre_completo: string })?.nombre_completo ?? "—";
              return (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900 max-w-[150px] truncate">
                    {personaNombre}
                  </td>
                  <td className="px-5 py-3 text-gray-600 capitalize">{a.tipo}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${SEVERIDAD_STYLES[a.severidad] ?? "bg-gray-100 text-gray-500"}`}>
                      {a.severidad}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-[250px] truncate">
                    {a.descripcion}
                  </td>
                  <td className="px-5 py-3">
                    <form action={toggleAlertaVerificada.bind(null, a.id, !a.verificada)}>
                      <button
                        type="submit"
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                          a.verificada
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {a.verificada ? "Verificada" : "Sin verificar"}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                    {a.detectada_at?.substring(0, 10)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <form action={deleteAlerta.bind(null, a.id)} className="inline">
                      <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-medium">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
