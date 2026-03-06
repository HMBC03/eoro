import { createClient } from "@/lib/supabase/server";
import { createPartido, updatePartido, deletePartido } from "../actions-political";

export default async function AdminPartidosPage() {
  const supabase = await createClient();
  const { data: partidos } = await supabase
    .schema("eoro")
    .from("partidos")
    .select("*")
    .order("nombre");

  const rows = partidos ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partidos</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear partido</p>
            <p className="text-[11px] text-gray-400">Registra un nuevo partido politico</p>
          </div>
        </summary>
        <form action={createPartido} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre</label>
            <input name="nombre" placeholder="Ej: Partido Verde" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Sigla</label>
            <input name="sigla" placeholder="Ej: PV" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Color</label>
            <input type="color" name="color_hex" defaultValue="#3B82F6" className="h-9 w-full rounded-xl border border-gray-200 cursor-pointer" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ideologia</label>
            <input name="ideologia" placeholder="Ej: Centro-izquierda" className={INPUT + " w-full"} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="personeria_juridica" value="true" className="rounded border-gray-300" />
            <label className="text-xs text-gray-600">Personeria juridica</label>
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear partido
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((p) => (
          <details key={p.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span
                className="inline-block h-5 w-5 rounded-full border border-gray-200 shrink-0"
                style={{ backgroundColor: p.color_hex || "#ccc" }}
              />
              <span className="font-medium text-gray-900 min-w-[150px]">{p.nombre}</span>
              <span className="text-gray-500 text-xs">{p.sigla}</span>
              <span className="text-gray-500 text-xs">{p.ideologia}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ml-auto ${
                p.activo ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
              }`}>
                {p.activo ? "Activo" : "Inactivo"}
              </span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updatePartido.bind(null, p.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre</label>
                  <input name="nombre" defaultValue={p.nombre ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Sigla</label>
                  <input name="sigla" defaultValue={p.sigla ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Color</label>
                  <input name="color_hex" type="color" defaultValue={p.color_hex ?? "#3B82F6"} className="h-9 w-14 rounded-xl border border-gray-200 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ideologia</label>
                  <input name="ideologia" defaultValue={p.ideologia ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Personeria juridica</label>
                  <select name="personeria_juridica" defaultValue={p.personeria_juridica ? "true" : "false"} className={INPUT + " w-full"}>
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Activo</label>
                  <select name="activo" defaultValue={p.activo ? "true" : "false"} className={INPUT + " w-full"}>
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deletePartido.bind(null, p.id)} className="inline">
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
