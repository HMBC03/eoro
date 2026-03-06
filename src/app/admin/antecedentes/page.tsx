import { createClient } from "@/lib/supabase/server";
import { createAntecedente, updateAntecedente, deleteAntecedente } from "../actions-detail";

export default async function AdminAntecedentesPage() {
  const supabase = await createClient();

  const [{ data: antecedentes }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("antecedentes")
      .select("*, personas(nombre_completo)")
      .order("created_at", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (antecedentes ?? []) as unknown as {
    id: string;
    persona_id: string;
    tipo: string;
    estado: string;
    descripcion: string;
    entidad_reporta: string;
    fecha_sancion: string | null;
    fecha_vencimiento: string | null;
    personas: { nombre_completo: string };
  }[];

  const personasList = personas ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Antecedentes</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear antecedente</p>
            <p className="text-[11px] text-gray-400">Agrega un antecedente legal</p>
          </div>
        </summary>
        <form action={createAntecedente} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
            <select name="tipo" required className={INPUT + " w-full"}>
              <option value="">Seleccionar tipo...</option>
              <option value="disciplinario">Disciplinario</option>
              <option value="fiscal">Fiscal</option>
              <option value="penal">Penal</option>
              <option value="perdida_investidura">Perdida de investidura</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Estado</label>
            <select name="estado" required className={INPUT + " w-full"}>
              <option value="">Seleccionar estado...</option>
              <option value="vigente">Vigente</option>
              <option value="archivado">Archivado</option>
              <option value="sancionado">Sancionado</option>
              <option value="absuelto">Absuelto</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Entidad que reporta</label>
            <input name="entidad_reporta" placeholder="Ej: Procuraduria General" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha sancion</label>
            <input name="fecha_sancion" type="date" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha vencimiento</label>
            <input name="fecha_vencimiento" type="date" className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Descripcion</label>
            <textarea name="descripcion" placeholder="Ej: Sancion disciplinaria por irregularidades en contratacion..." rows={2} className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear antecedente
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((a) => (
          <details key={a.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900 min-w-[150px]">{a.personas?.nombre_completo}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                a.tipo === "penal" ? "bg-red-50 text-red-700" :
                a.tipo === "fiscal" ? "bg-amber-50 text-amber-700" :
                a.tipo === "disciplinario" ? "bg-blue-50 text-blue-700" :
                "bg-purple-50 text-purple-700"
              }`}>
                {a.tipo}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                a.estado === "vigente" ? "bg-red-50 text-red-700" :
                a.estado === "sancionado" ? "bg-amber-50 text-amber-700" :
                a.estado === "absuelto" ? "bg-emerald-50 text-emerald-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {a.estado}
              </span>
              <span className="text-gray-500 text-xs">{a.entidad_reporta}</span>
              <span className="text-gray-400 text-xs ml-auto">{a.fecha_sancion}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateAntecedente.bind(null, a.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona</label>
                  <select name="persona_id" defaultValue={a.persona_id} required className={INPUT + " w-full"}>
                    {personasList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
                  <select name="tipo" defaultValue={a.tipo} required className={INPUT + " w-full"}>
                    <option value="disciplinario">Disciplinario</option>
                    <option value="fiscal">Fiscal</option>
                    <option value="penal">Penal</option>
                    <option value="perdida_investidura">Perdida de investidura</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Estado</label>
                  <select name="estado" defaultValue={a.estado} required className={INPUT + " w-full"}>
                    <option value="vigente">Vigente</option>
                    <option value="archivado">Archivado</option>
                    <option value="sancionado">Sancionado</option>
                    <option value="absuelto">Absuelto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Entidad que reporta</label>
                  <input name="entidad_reporta" defaultValue={a.entidad_reporta ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha sancion</label>
                  <input name="fecha_sancion" type="date" defaultValue={a.fecha_sancion ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha vencimiento</label>
                  <input name="fecha_vencimiento" type="date" defaultValue={a.fecha_vencimiento ?? ""} className={INPUT + " w-full"} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Descripcion</label>
                  <textarea name="descripcion" defaultValue={a.descripcion ?? ""} rows={3} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteAntecedente.bind(null, a.id)} className="inline">
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
