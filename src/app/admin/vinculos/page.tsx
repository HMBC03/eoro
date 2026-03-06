import { createClient } from "@/lib/supabase/server";
import { createVinculo, updateVinculo, deleteVinculo } from "../actions-detail";

export default async function AdminVinculosPage() {
  const supabase = await createClient();

  const [{ data: vinculos }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("vinculos_familiares")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (vinculos ?? []) as unknown as {
    id: string;
    persona_a_id: string;
    persona_b_id: string;
    parentesco: string;
    verificado: boolean;
    fuente: string;
  }[];

  const personasList = personas ?? [];
  const personaMap = new Map(personasList.map((p) => [p.id, p.nombre_completo]));

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vinculos Familiares</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear vinculo</p>
            <p className="text-[11px] text-gray-400">Registra un vinculo entre personas</p>
          </div>
        </summary>
        <form action={createVinculo} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona A</label>
            <select name="persona_a_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar persona...</option>
              {personasList.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre_completo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona B</label>
            <select name="persona_b_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar persona...</option>
              {personasList.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre_completo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Parentesco</label>
            <input name="parentesco" placeholder="Ej: Hermano, Conyuge, Primo" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fuente</label>
            <input name="fuente" placeholder="Ej: Registraduria Nacional" className={INPUT + " w-full"} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="verificado" value="true" className="rounded border-gray-300" />
            <label className="text-xs text-gray-600">Verificado</label>
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear vinculo
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((v) => (
          <details key={v.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900">{personaMap.get(v.persona_a_id) ?? v.persona_a_id}</span>
              <span className="text-gray-400 text-xs">---</span>
              <span className="font-medium text-gray-900">{personaMap.get(v.persona_b_id) ?? v.persona_b_id}</span>
              <span className="text-gray-500 text-xs">{v.parentesco}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ml-auto ${
                v.verificado ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
              }`}>
                {v.verificado ? "Verificado" : "Sin verificar"}
              </span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateVinculo.bind(null, v.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona A</label>
                  <select name="persona_a_id" defaultValue={v.persona_a_id} required className={INPUT + " w-full"}>
                    {personasList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona B</label>
                  <select name="persona_b_id" defaultValue={v.persona_b_id} required className={INPUT + " w-full"}>
                    {personasList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Parentesco</label>
                  <input name="parentesco" defaultValue={v.parentesco ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Verificado</label>
                  <select name="verificado" defaultValue={v.verificado ? "true" : "false"} className={INPUT + " w-full"}>
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteVinculo.bind(null, v.id)} className="inline">
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
