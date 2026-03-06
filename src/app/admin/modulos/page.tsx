import { createClient } from "@/lib/supabase/server";
import { toggleModuleVisibility } from "../actions";

export default async function AdminModulosPage() {
  const supabase = await createClient();
  const { data: modulos } = await supabase
    .schema("eoro")
    .from("module_config")
    .select("*")
    .order("orden");

  const rows = modulos ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modulos</h1>
        <p className="text-sm text-gray-400 mt-1">
          Controla la visibilidad de cada seccion publica
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
              <th className="px-5 py-3">Orden</th>
              <th className="px-5 py-3">Modulo</th>
              <th className="px-5 py-3">Clave</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-400">{m.orden}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{m.label}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{m.module_key}</td>
                <td className="px-5 py-3">
                  <form action={toggleModuleVisibility.bind(null, m.module_key, !m.visible)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                        m.visible
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {m.visible ? "Visible" : "Oculto"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
