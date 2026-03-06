import { createClient } from "@/lib/supabase/server";
import { createDeclaracion, updateDeclaracion, deleteDeclaracion } from "../actions-detail";

export default async function AdminDeclaracionesPage() {
  const supabase = await createClient();

  const [{ data: declaraciones }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("declaraciones_patrimonio")
      .select("*, personas(nombre_completo)")
      .order("anio", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (declaraciones ?? []) as unknown as {
    id: string;
    persona_id: string;
    anio: number;
    patrimonio_total: number;
    ingresos_total: number;
    bienes_inmuebles_valor: number;
    vehiculos_valor: number;
    cuentas_bancarias_saldo: number;
    personas: { nombre_completo: string };
  }[];

  const personasList = personas ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Declaraciones de Patrimonio</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear declaracion</p>
            <p className="text-[11px] text-gray-400">Registra declaracion patrimonial</p>
          </div>
        </summary>
        <form action={createDeclaracion} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ano</label>
            <input name="anio" type="number" placeholder="Ej: 2025" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Patrimonio total</label>
            <input name="patrimonio_total" type="number" placeholder="Ej: 500000000" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ingresos total</label>
            <input name="ingresos_total" type="number" placeholder="Ej: 120000000" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Bienes inmuebles</label>
            <input name="bienes_inmuebles_valor" type="number" placeholder="Ej: 300000000" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Vehiculos</label>
            <input name="vehiculos_valor" type="number" placeholder="Ej: 80000000" className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Cuentas bancarias</label>
            <input name="cuentas_bancarias_saldo" type="number" placeholder="Ej: 50000000" className={INPUT + " w-full"} />
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear declaracion
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((d) => (
          <details key={d.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900 min-w-[150px]">{d.personas?.nombre_completo}</span>
              <span className="text-gray-500 text-xs">{d.anio}</span>
              <span className="text-gray-900 text-xs font-semibold">{fmt(d.patrimonio_total)}</span>
              <span className="text-gray-500 text-xs ml-auto">Ingresos: {fmt(d.ingresos_total)}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateDeclaracion.bind(null, d.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona</label>
                  <select name="persona_id" defaultValue={d.persona_id} required className={INPUT + " w-full"}>
                    {personasList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ano</label>
                  <input name="anio" type="number" defaultValue={d.anio} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Patrimonio total</label>
                  <input name="patrimonio_total" type="number" defaultValue={d.patrimonio_total} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ingresos total</label>
                  <input name="ingresos_total" type="number" defaultValue={d.ingresos_total} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Bienes inmuebles</label>
                  <input name="bienes_inmuebles_valor" type="number" defaultValue={d.bienes_inmuebles_valor} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Vehiculos</label>
                  <input name="vehiculos_valor" type="number" defaultValue={d.vehiculos_valor} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Cuentas bancarias</label>
                  <input name="cuentas_bancarias_saldo" type="number" defaultValue={d.cuentas_bancarias_saldo} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteDeclaracion.bind(null, d.id)} className="inline">
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
