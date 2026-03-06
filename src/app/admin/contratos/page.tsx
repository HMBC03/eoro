import { createClient } from "@/lib/supabase/server";
import { updateContrato, deleteContrato } from "../actions";
import { formatCOPShort } from "@/lib/formatters";

export default async function AdminContratosPage() {
  const supabase = await createClient();
  const { data: contratos } = await supabase
    .schema("eoro")
    .from("contratos")
    .select("*")
    .order("fecha_firma", { ascending: false });

  const rows = contratos ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const ESTADO_STYLES: Record<string, string> = {
    activo: "bg-emerald-50 text-emerald-700",
    finalizado: "bg-blue-50 text-blue-700",
    liquidado: "bg-gray-100 text-gray-500",
    terminado_anticipadamente: "bg-red-50 text-red-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
        <p className="text-sm text-gray-400 mt-1">{rows.length} registros en SECOP</p>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((c) => (
          <details key={c.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900 min-w-[180px] truncate">{c.entidad_nombre}</span>
              <span className="text-gray-500 text-xs truncate max-w-[150px]">{c.contratista_nombre}</span>
              <span className="text-gray-900 text-xs font-semibold whitespace-nowrap">{formatCOPShort(Number(c.valor_contrato))}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ESTADO_STYLES[c.estado] ?? "bg-gray-100 text-gray-500"}`}>
                {c.estado?.replace("_", " ")}
              </span>
              <span className="text-gray-400 text-xs ml-auto whitespace-nowrap">{c.fecha_firma}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateContrato.bind(null, c.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Entidad</label>
                  <input name="entidad_nombre" defaultValue={c.entidad_nombre ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Contratista</label>
                  <input name="contratista_nombre" defaultValue={c.contratista_nombre ?? ""} className={INPUT + " w-full"} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Objeto</label>
                  <textarea name="objeto" defaultValue={c.objeto ?? ""} rows={2} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Valor contrato</label>
                  <input name="valor_contrato" type="number" defaultValue={c.valor_contrato ?? 0} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Estado</label>
                  <select name="estado" defaultValue={c.estado ?? ""} className={INPUT + " w-full"}>
                    <option value="activo">Activo</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="liquidado">Liquidado</option>
                    <option value="terminado_anticipadamente">Terminado anticipadamente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Departamento</label>
                  <input name="departamento" defaultValue={c.departamento ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Fecha firma</label>
                  <input name="fecha_firma" type="date" defaultValue={c.fecha_firma ?? ""} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteContrato.bind(null, c.id)} className="inline">
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
