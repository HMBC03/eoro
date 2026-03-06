import { createClient } from "@/lib/supabase/server";
import { createCargo, updateCargo, deleteCargo } from "../actions-political";

export default async function AdminCargosPage() {
  const supabase = await createClient();

  const [{ data: cargos }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("cargos_publicos")
      .select("*, personas(nombre_completo)")
      .order("fecha_inicio", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (cargos ?? []) as unknown as {
    id: string;
    persona_id: string;
    cargo: string;
    entidad: string;
    departamento: string;
    municipio: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    nivel: string;
    personas: { nombre_completo: string };
  }[];

  const personasList = personas ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cargos Publicos</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear cargo</p>
            <p className="text-[11px] text-gray-400">Registra un cargo publico</p>
          </div>
        </summary>
        <form action={createCargo} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona</label>
            <select name="persona_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar persona...</option>
              {personasList.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre_completo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Cargo</label>
            <input name="cargo" placeholder="Ej: Senador de la Republica" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Entidad</label>
            <input name="entidad" placeholder="Ej: Congreso de la Republica" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Departamento</label>
            <input name="departamento" placeholder="Ej: Cundinamarca" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Municipio</label>
            <input name="municipio" placeholder="Ej: Bogota" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha inicio</label>
            <input name="fecha_inicio" type="date" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha fin</label>
            <input name="fecha_fin" type="date" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nivel</label>
            <select name="nivel" className={INPUT + " w-full"}>
              <option value="">Seleccionar nivel...</option>
              <option value="nacional">Nacional</option>
              <option value="departamental">Departamental</option>
              <option value="municipal">Municipal</option>
            </select>
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear cargo
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((c) => (
          <details key={c.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900 min-w-[150px]">{c.personas?.nombre_completo}</span>
              <span className="text-gray-500 text-xs">{c.cargo}</span>
              <span className="text-gray-500 text-xs">{c.entidad}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                c.nivel === "nacional" ? "bg-blue-50 text-blue-700" :
                c.nivel === "departamental" ? "bg-purple-50 text-purple-700" :
                "bg-amber-50 text-amber-700"
              }`}>
                {c.nivel}
              </span>
              <span className="text-gray-400 text-xs ml-auto">{c.fecha_inicio} — {c.fecha_fin ?? "Actual"}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateCargo.bind(null, c.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona</label>
                  <select name="persona_id" defaultValue={c.persona_id} required className={INPUT + " w-full"}>
                    {personasList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Cargo</label>
                  <input name="cargo" defaultValue={c.cargo ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Entidad</label>
                  <input name="entidad" defaultValue={c.entidad ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Departamento</label>
                  <input name="departamento" defaultValue={c.departamento ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Municipio</label>
                  <input name="municipio" defaultValue={c.municipio ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha inicio</label>
                  <input name="fecha_inicio" type="date" defaultValue={c.fecha_inicio ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha fin</label>
                  <input name="fecha_fin" type="date" defaultValue={c.fecha_fin ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nivel</label>
                  <select name="nivel" defaultValue={c.nivel ?? ""} className={INPUT + " w-full"}>
                    <option value="nacional">Nacional</option>
                    <option value="departamental">Departamental</option>
                    <option value="municipal">Municipal</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteCargo.bind(null, c.id)} className="inline">
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
