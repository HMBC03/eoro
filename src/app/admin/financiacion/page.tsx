import { createClient } from "@/lib/supabase/server";
import { createFinanciacion, updateFinanciacion, deleteFinanciacion } from "../actions-detail";

export default async function AdminFinanciacionPage() {
  const supabase = await createClient();

  const [{ data: financiacion }, { data: candidaturas }, { data: personas }] =
    await Promise.all([
      supabase
        .schema("eoro")
        .from("financiacion_campana")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .schema("eoro")
        .from("candidaturas")
        .select("id, persona_id, tipo, eleccion_year")
        .order("eleccion_year", { ascending: false }),
      supabase
        .schema("eoro")
        .from("personas")
        .select("id, nombre_completo")
        .order("nombre_completo"),
    ]);

  const rows = (financiacion ?? []) as unknown as {
    id: string;
    candidatura_id: string;
    tipo: string;
    concepto: string;
    valor: number;
    aportante_nombre: string;
    aportante_tipo: string;
  }[];

  const candidaturasList = candidaturas ?? [];
  const personasList = personas ?? [];
  const personaMap = new Map(personasList.map((p) => [p.id, p.nombre_completo]));

  // Build candidatura display labels
  const candidaturaOptions = candidaturasList.map((c) => ({
    id: c.id,
    label: `${personaMap.get(c.persona_id) ?? "?"} - ${c.tipo} - ${c.eleccion_year}`,
  }));

  const candidaturaMap = new Map(candidaturaOptions.map((c) => [c.id, c.label]));

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financiacion de Campana</h1>
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
            <p className="text-sm font-bold text-gray-900">Crear registro</p>
            <p className="text-[11px] text-gray-400">Registra movimiento financiero</p>
          </div>
        </summary>
        <form action={createFinanciacion} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Candidatura</label>
            <select name="candidatura_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar candidatura...</option>
              {candidaturaOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
            <select name="tipo" required className={INPUT + " w-full"}>
              <option value="">Seleccionar tipo...</option>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Concepto</label>
            <input name="concepto" placeholder="Ej: Donacion de campana" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Valor</label>
            <input name="valor" type="number" placeholder="Ej: 50000000" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre aportante</label>
            <input name="aportante_nombre" placeholder="Ej: Juan Perez S.A.S" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo aportante</label>
            <select name="aportante_tipo" className={INPUT + " w-full"}>
              <option value="">Seleccionar tipo...</option>
              <option value="propio">Propio</option>
              <option value="familiar">Familiar</option>
              <option value="particular">Particular</option>
              <option value="empresa">Empresa</option>
              <option value="estatal">Estatal</option>
              <option value="credito">Credito</option>
            </select>
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear registro
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((f) => (
          <details key={f.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900 min-w-[180px] truncate">{candidaturaMap.get(f.candidatura_id) ?? f.candidatura_id}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                f.tipo === "ingreso" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}>
                {f.tipo}
              </span>
              <span className="text-gray-500 text-xs">{f.concepto}</span>
              <span className="text-gray-900 text-xs font-semibold">{fmt(f.valor)}</span>
              <span className="text-gray-400 text-xs ml-auto">{f.aportante_nombre}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateFinanciacion.bind(null, f.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Candidatura</label>
                  <select name="candidatura_id" defaultValue={f.candidatura_id} required className={INPUT + " w-full"}>
                    {candidaturaOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
                  <select name="tipo" defaultValue={f.tipo} required className={INPUT + " w-full"}>
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Concepto</label>
                  <input name="concepto" defaultValue={f.concepto ?? ""} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Valor</label>
                  <input name="valor" type="number" defaultValue={f.valor} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Nombre aportante</label>
                  <input name="aportante_nombre" defaultValue={f.aportante_nombre ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo aportante</label>
                  <select name="aportante_tipo" defaultValue={f.aportante_tipo ?? ""} className={INPUT + " w-full"}>
                    <option value="">--</option>
                    <option value="propio">Propio</option>
                    <option value="familiar">Familiar</option>
                    <option value="particular">Particular</option>
                    <option value="empresa">Empresa</option>
                    <option value="estatal">Estatal</option>
                    <option value="credito">Credito</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteFinanciacion.bind(null, f.id)} className="inline">
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
