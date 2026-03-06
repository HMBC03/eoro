import { createClient } from "@/lib/supabase/server";
import { createGrafoEdge, updateGrafoEdge, deleteGrafoEdge } from "../actions-grafos";

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

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grafo - Edges</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="group/create rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-white group-open/create:bg-[#c4e615] group-open/create:text-gray-900 transition-colors shrink-0">
            <svg className="h-4 w-4 transition-transform group-open/create:rotate-45" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Crear edge</p>
            <p className="text-[11px] text-gray-400">Conecta dos nodos del grafo</p>
          </div>
        </summary>
        <form action={createGrafoEdge} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Source</label>
            <select name="source_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar nodo origen...</option>
              {nodosList.map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Target</label>
            <select name="target_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar nodo destino...</option>
              {nodosList.map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
            <select name="tipo" required className={INPUT + " w-full"}>
              <option value="">Seleccionar tipo...</option>
              <option value="familiar">Familiar</option>
              <option value="cargo">Cargo</option>
              <option value="contrato">Contrato</option>
              <option value="partido">Partido</option>
              <option value="financiador">Financiador</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Label</label>
            <input name="label" placeholder="Ej: Hermano de, Contrato con" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Peso</label>
            <input name="peso" type="number" placeholder="Ej: 1" defaultValue={1} className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear edge
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((e) => (
          <details key={e.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900">{nodoMap.get(e.source_id) ?? e.source_id}</span>
              <span className="text-gray-400 text-xs">---</span>
              <span className="font-medium text-gray-900">{nodoMap.get(e.target_id) ?? e.target_id}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                e.tipo === "familiar" ? "bg-purple-50 text-purple-700" :
                e.tipo === "cargo" ? "bg-emerald-50 text-emerald-700" :
                e.tipo === "contrato" ? "bg-amber-50 text-amber-700" :
                e.tipo === "partido" ? "bg-blue-50 text-blue-700" :
                "bg-red-50 text-red-700"
              }`}>
                {e.tipo}
              </span>
              <span className="text-gray-500 text-xs">{e.label}</span>
              <span className="text-gray-400 text-xs ml-auto">peso: {e.peso}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateGrafoEdge.bind(null, e.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Source</label>
                  <select name="source_id" defaultValue={e.source_id} required className={INPUT + " w-full"}>
                    {nodosList.map((n) => (
                      <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Target</label>
                  <select name="target_id" defaultValue={e.target_id} required className={INPUT + " w-full"}>
                    {nodosList.map((n) => (
                      <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
                  <select name="tipo" defaultValue={e.tipo} required className={INPUT + " w-full"}>
                    <option value="familiar">Familiar</option>
                    <option value="cargo">Cargo</option>
                    <option value="contrato">Contrato</option>
                    <option value="partido">Partido</option>
                    <option value="financiador">Financiador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Label</label>
                  <input name="label" defaultValue={e.label ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Peso</label>
                  <input name="peso" type="number" defaultValue={e.peso} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteGrafoEdge.bind(null, e.id)} className="inline">
                    <button type="submit" className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                      Eliminar
                    </button>
                  </form>
                </div>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
