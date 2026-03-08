import { createClient } from "@/lib/supabase/server";
import { createPersona, updatePersona, deletePersona } from "../actions";

export default async function AdminPersonasPage() {
  const supabase = await createClient();
  const { data: personas } = await supabase
    .schema("eoro")
    .from("personas")
    .select("*")
    .order("nombre_completo");

  const rows = personas ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear persona</p>
            <p className="text-[11px] text-gray-400">Agrega un nuevo registro al sistema</p>
          </div>
        </summary>
        <form action={createPersona} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre completo</label>
            <input name="nombre_completo" placeholder="Ej: Juan Perez" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Cedula</label>
            <input name="cedula" placeholder="Ej: 1234567890" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Departamento</label>
            <input name="departamento_origen" placeholder="Ej: Antioquia" className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Biografia</label>
            <textarea name="biografia" placeholder="Breve descripcion..." rows={2} className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear persona
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
              <span className="font-medium text-gray-900 min-w-[200px]">{p.nombre_completo}</span>
              <span className="text-gray-500 text-xs">{p.cedula}</span>
              <span className="text-gray-400 text-xs ml-auto">{p.departamento_origen}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updatePersona.bind(null, p.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre completo</label>
                  <input name="nombre_completo" defaultValue={p.nombre_completo} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Cedula</label>
                  <input name="cedula" defaultValue={p.cedula} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Departamento</label>
                  <input name="departamento_origen" defaultValue={p.departamento_origen ?? ""} className={INPUT + " w-full"} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Biografia</label>
                  <textarea name="biografia" defaultValue={p.biografia ?? ""} rows={3} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deletePersona.bind(null, p.id)} className="inline">
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
