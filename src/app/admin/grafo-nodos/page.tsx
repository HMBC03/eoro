import { createClient } from "@/lib/supabase/server";
import { createGrafoNodo, updateGrafoNodo, deleteGrafoNodo } from "../actions-grafos";

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

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grafo - Nodos</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear nodo</p>
            <p className="text-[11px] text-gray-400">Agrega un nodo al grafo</p>
          </div>
        </summary>
        <form action={createGrafoNodo} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Label</label>
            <input name="label" placeholder="Ej: Juan Perez" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
            <select name="tipo" required className={INPUT + " w-full"}>
              <option value="">Seleccionar tipo...</option>
              <option value="candidato">Candidato</option>
              <option value="familiar">Familiar</option>
              <option value="cargo">Cargo</option>
              <option value="contratista">Contratista</option>
              <option value="partido">Partido</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Color</label>
            <input type="color" name="color" defaultValue="#3B82F6" className="h-9 w-full rounded-xl border border-gray-200 cursor-pointer" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Foto URL</label>
            <input name="foto_url" placeholder="Ej: https://ejemplo.com/foto.jpg" className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear nodo
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((n) => (
          <details key={n.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span
                className="inline-block h-5 w-5 rounded-full border border-gray-200 shrink-0"
                style={{ backgroundColor: n.color || "#ccc" }}
              />
              <span className="font-medium text-gray-900 min-w-[150px]">{n.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                n.tipo === "candidato" ? "bg-blue-50 text-blue-700" :
                n.tipo === "familiar" ? "bg-purple-50 text-purple-700" :
                n.tipo === "cargo" ? "bg-emerald-50 text-emerald-700" :
                n.tipo === "contratista" ? "bg-amber-50 text-amber-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {n.tipo}
              </span>
              <span className="text-gray-400 text-xs ml-auto truncate max-w-[150px]">{n.foto_url ?? ""}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateGrafoNodo.bind(null, n.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Label</label>
                  <input name="label" defaultValue={n.label ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
                  <select name="tipo" defaultValue={n.tipo} required className={INPUT + " w-full"}>
                    <option value="candidato">Candidato</option>
                    <option value="familiar">Familiar</option>
                    <option value="cargo">Cargo</option>
                    <option value="contratista">Contratista</option>
                    <option value="partido">Partido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Color</label>
                  <input name="color" type="color" defaultValue={n.color ?? "#3B82F6"} className="h-9 w-14 rounded-xl border border-gray-200 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Foto URL</label>
                  <input name="foto_url" defaultValue={n.foto_url ?? ""} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteGrafoNodo.bind(null, n.id)} className="inline">
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
