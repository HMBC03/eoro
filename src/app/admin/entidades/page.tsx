import { createClient } from "@/lib/supabase/server";
import { createEntidad, updateEntidad, deleteEntidad } from "../actions-presupuesto";

export default async function AdminEntidadesPage() {
  const supabase = await createClient();

  const [{ data: entidades }, { data: ramas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("entidades_presupuestales")
      .select("*, ramas_gobierno(nombre)")
      .order("nombre"),
    supabase
      .schema("eoro")
      .from("ramas_gobierno")
      .select("id, nombre")
      .order("nombre"),
  ]);

  const rows = (entidades ?? []) as unknown as {
    id: string;
    rama_id: string;
    nombre: string;
    tipo: string;
    presupuesto_asignado: number;
    ejecutado: number;
    porcentaje_ejecucion: number;
    ramas_gobierno: { nombre: string };
  }[];

  const ramasList = ramas ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entidades Presupuestales</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear entidad</p>
            <p className="text-[11px] text-gray-400">Registra una entidad publica</p>
          </div>
        </summary>
        <form action={createEntidad} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Rama</label>
            <select name="rama_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar rama...</option>
              {ramasList.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre</label>
            <input name="nombre" placeholder="Ej: Ministerio de Hacienda" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
            <select name="tipo" required className={INPUT + " w-full"}>
              <option value="">Seleccionar tipo...</option>
              <option value="ministerio">Ministerio</option>
              <option value="departamento_admin">Departamento administrativo</option>
              <option value="corporacion">Corporacion</option>
              <option value="corte">Corte</option>
              <option value="organo_control">Organo de control</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Presupuesto asignado</label>
            <input name="presupuesto_asignado" type="number" placeholder="Ej: 5000000000000" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ejecutado</label>
            <input name="ejecutado" type="number" placeholder="Ej: 3500000000000" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">% Ejecucion</label>
            <input name="porcentaje_ejecucion" type="number" step="0.01" placeholder="Ej: 70.5" className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear entidad
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
              <span className="font-medium text-gray-900 min-w-[180px]">{e.nombre}</span>
              <span className="text-gray-500 text-xs">{e.ramas_gobierno?.nombre}</span>
              <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">
                {e.tipo}
              </span>
              <span className="text-gray-900 text-xs font-semibold">{fmt(e.presupuesto_asignado)}</span>
              <span className="text-gray-400 text-xs ml-auto">{e.porcentaje_ejecucion}% ejec.</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateEntidad.bind(null, e.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Rama</label>
                  <select name="rama_id" defaultValue={e.rama_id} required className={INPUT + " w-full"}>
                    {ramasList.map((r) => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre</label>
                  <input name="nombre" defaultValue={e.nombre ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
                  <select name="tipo" defaultValue={e.tipo} required className={INPUT + " w-full"}>
                    <option value="ministerio">Ministerio</option>
                    <option value="departamento_admin">Departamento administrativo</option>
                    <option value="corporacion">Corporacion</option>
                    <option value="corte">Corte</option>
                    <option value="organo_control">Organo de control</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Presupuesto asignado</label>
                  <input name="presupuesto_asignado" type="number" defaultValue={e.presupuesto_asignado} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ejecutado</label>
                  <input name="ejecutado" type="number" defaultValue={e.ejecutado} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">% Ejecucion</label>
                  <input name="porcentaje_ejecucion" type="number" step="0.01" defaultValue={e.porcentaje_ejecucion} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteEntidad.bind(null, e.id)} className="inline">
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
