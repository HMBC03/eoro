import { createClient } from "@/lib/supabase/server";
import { createDynastyNode, deleteDynastyNode } from "../actions-grafos";

export default async function AdminDynastyNodosPage() {
  const supabase = await createClient();

  const [{ data: nodes }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("dynasty_nodes")
      .select("*")
      .order("generation"),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (nodes ?? []) as unknown as {
    id: string;
    nombre: string;
    rol: string;
    tipo: string;
    generation: number;
    color: string | null;
    candidato_id: string | null;
  }[];

  const personasList = personas ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dynasty - Nodos</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear nodo dynasty
        </summary>
        <form action={createDynastyNode} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="nombre" placeholder="Nombre *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="rol" placeholder="Rol *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="main">Main</option>
            <option value="ancestor">Ancestor</option>
            <option value="relative">Relative</option>
          </select>
          <input name="generation" type="number" placeholder="Generacion *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Color:</label>
            <input name="color" type="color" defaultValue="#3B82F6" className="h-9 w-14 rounded-xl border border-gray-200 cursor-pointer" />
          </div>
          <select name="candidato_id" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Candidato (opcional)</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
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
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Gen.</th>
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
                <td className="px-5 py-3 font-medium text-gray-900">{n.nombre}</td>
                <td className="px-5 py-3 text-gray-500">{n.rol}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    n.tipo === "main" ? "bg-blue-50 text-blue-700" :
                    n.tipo === "ancestor" ? "bg-purple-50 text-purple-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {n.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{n.generation}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteDynastyNode.bind(null, n.id)} className="inline">
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
