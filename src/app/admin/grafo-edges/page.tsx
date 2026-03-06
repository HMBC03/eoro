import { createClient } from "@/lib/supabase/server";
import { createGrafoEdge, deleteGrafoEdge } from "../actions-grafos";

export default async function AdminGrafoEdgesPage() {
  const supabase = await createClient();

  const [{ data: edges }, { data: nodos }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("grafo_edges")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .schema("eoro")
      .from("grafo_nodos")
      .select("id, label")
      .order("label"),
  ]);

  const rows = (edges ?? []) as unknown as {
    id: string;
    source_id: string;
    target_id: string;
    tipo: string;
    label: string;
    peso: number;
  }[];

  const nodosList = nodos ?? [];
  const nodoMap = new Map(nodosList.map((n) => [n.id, n.label]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grafo - Edges</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear edge
        </summary>
        <form action={createGrafoEdge} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="source_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Source *</option>
            {nodosList.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
          <select name="target_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Target *</option>
            {nodosList.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="familiar">Familiar</option>
            <option value="cargo">Cargo</option>
            <option value="contrato">Contrato</option>
            <option value="partido">Partido</option>
            <option value="financiador">Financiador</option>
          </select>
          <input name="label" placeholder="Label *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="peso" type="number" placeholder="Peso" defaultValue={1} className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Label</th>
              <th className="px-5 py-3">Peso</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{nodoMap.get(e.source_id) ?? e.source_id}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{nodoMap.get(e.target_id) ?? e.target_id}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    e.tipo === "familiar" ? "bg-purple-50 text-purple-700" :
                    e.tipo === "cargo" ? "bg-emerald-50 text-emerald-700" :
                    e.tipo === "contrato" ? "bg-amber-50 text-amber-700" :
                    e.tipo === "partido" ? "bg-blue-50 text-blue-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {e.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{e.label}</td>
                <td className="px-5 py-3 text-gray-500">{e.peso}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteGrafoEdge.bind(null, e.id)} className="inline">
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
