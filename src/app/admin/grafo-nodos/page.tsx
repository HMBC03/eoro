import { createClient } from "@/lib/supabase/server";
import { createGrafoNodo, deleteGrafoNodo } from "../actions-grafos";

export default async function AdminGrafoNodosPage() {
  const supabase = await createClient();
  const { data: nodos } = await supabase
    .schema("eoro")
    .from("grafo_nodos")
    .select("*")
    .order("label");

  const rows = (nodos ?? []) as unknown as {
    id: string;
    label: string;
    tipo: string;
    color: string | null;
    foto_url: string | null;
  }[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grafo - Nodos</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear nodo
        </summary>
        <form action={createGrafoNodo} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="label" placeholder="Label *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="candidato">Candidato</option>
            <option value="familiar">Familiar</option>
            <option value="cargo">Cargo</option>
            <option value="contratista">Contratista</option>
            <option value="partido">Partido</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Color:</label>
            <input name="color" type="color" defaultValue="#3B82F6" className="h-9 w-14 rounded-xl border border-gray-200 cursor-pointer" />
          </div>
          <input name="foto_url" placeholder="Foto URL" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Label</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Foto</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => (
              <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <span
                    className="inline-block h-5 w-5 rounded-full border border-gray-200"
                    style={{ backgroundColor: n.color || "#ccc" }}
                  />
                </td>
                <td className="px-5 py-3 font-medium text-gray-900">{n.label}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    n.tipo === "candidato" ? "bg-blue-50 text-blue-700" :
                    n.tipo === "familiar" ? "bg-purple-50 text-purple-700" :
                    n.tipo === "cargo" ? "bg-emerald-50 text-emerald-700" :
                    n.tipo === "contratista" ? "bg-amber-50 text-amber-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {n.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500 max-w-[150px] truncate">{n.foto_url ?? "-"}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteGrafoNodo.bind(null, n.id)} className="inline">
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
