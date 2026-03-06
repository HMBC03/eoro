import { createClient } from "@/lib/supabase/server";
import { createPartido, deletePartido } from "../actions-political";

export default async function AdminPartidosPage() {
  const supabase = await createClient();
  const { data: partidos } = await supabase
    .schema("eoro")
    .from("partidos")
    .select("id, nombre, sigla, color_hex, ideologia, activo")
    .order("nombre");

  const rows = partidos ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partidos</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear partido
        </summary>
        <form action={createPartido} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="nombre" placeholder="Nombre *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="sigla" placeholder="Sigla *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Color:</label>
            <input name="color_hex" type="color" defaultValue="#3B82F6" className="h-9 w-14 rounded-xl border border-gray-200 cursor-pointer" />
          </div>
          <input name="ideologia" placeholder="Ideologia" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input name="personeria_juridica" type="checkbox" value="true" className="rounded" />
            Personeria juridica
          </label>
          <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            Crear
          </button>
        </form>
      </details>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
              <th className="px-5 py-3">Color</th>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Sigla</th>
              <th className="px-5 py-3">Ideologia</th>
              <th className="px-5 py-3">Activo</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <span
                    className="inline-block h-5 w-5 rounded-full border border-gray-200"
                    style={{ backgroundColor: p.color_hex || "#ccc" }}
                  />
                </td>
                <td className="px-5 py-3 font-medium text-gray-900">{p.nombre}</td>
                <td className="px-5 py-3 text-gray-500">{p.sigla}</td>
                <td className="px-5 py-3 text-gray-500">{p.ideologia}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    p.activo ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {p.activo ? "Si" : "No"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <form action={deletePartido.bind(null, p.id)} className="inline">
                    <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-medium">
                      Eliminar
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
