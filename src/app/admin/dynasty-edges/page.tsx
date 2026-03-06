import { createClient } from "@/lib/supabase/server";
import { createDynastyEdge, deleteDynastyEdge } from "../actions-grafos";

export default async function AdminDynastyEdgesPage() {
  const supabase = await createClient();

  const [{ data: edges }, { data: nodes }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("dynasty_edges")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .schema("eoro")
      .from("dynasty_nodes")
      .select("id, nombre")
      .order("nombre"),
  ]);

  const rows = (edges ?? []) as unknown as {
    id: string;
    source_id: string;
    target_id: string;
    label: string;
  }[];

  const nodesList = nodes ?? [];
  const nodeMap = new Map(nodesList.map((n) => [n.id, n.nombre]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dynasty - Edges</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear edge dynasty
        </summary>
        <form action={createDynastyEdge} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="source_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Source *</option>
            {nodesList.map((n) => (
              <option key={n.id} value={n.id}>{n.nombre}</option>
            ))}
          </select>
          <select name="target_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Target *</option>
            {nodesList.map((n) => (
              <option key={n.id} value={n.id}>{n.nombre}</option>
            ))}
          </select>
          <input name="label" placeholder="Label (ej: padre, madre, hermano) *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Target</th>
              <th className="px-5 py-3">Label</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{nodeMap.get(e.source_id) ?? e.source_id}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{nodeMap.get(e.target_id) ?? e.target_id}</td>
                <td className="px-5 py-3 text-gray-500">{e.label}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteDynastyEdge.bind(null, e.id)} className="inline">
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
