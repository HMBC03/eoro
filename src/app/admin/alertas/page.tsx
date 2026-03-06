import { createClient } from "@/lib/supabase/server";
import { updateAlerta, deleteAlerta } from "../actions";

export default async function AdminAlertasPage() {
  const supabase = await createClient();
  const { data: alertas } = await supabase
    .schema("eoro")
    .from("alertas")
    .select("*, personas(nombre_completo)")
    .order("detectada_at", { ascending: false });

  const rows = (alertas ?? []) as unknown as {
    id: string;
    tipo: string;
    severidad: string;
    descripcion: string;
    verificada: boolean;
    detectada_at: string;
    persona_id: string;
    personas: { nombre_completo: string };
  }[];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const SEVERIDAD_STYLES: Record<string, string> = {
    alta: "bg-red-50 text-red-700",
    media: "bg-amber-50 text-amber-700",
    baja: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
        <p className="text-sm text-gray-400 mt-1">{rows.length} alertas registradas</p>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((a) => {
          const personaNombre = a.personas?.nombre_completo ?? "—";
          return (
            <details key={a.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
              <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
                <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-gray-900 min-w-[150px]">{personaNombre}</span>
                <span className="text-gray-600 text-xs capitalize">{a.tipo}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${SEVERIDAD_STYLES[a.severidad] ?? "bg-gray-100 text-gray-500"}`}>
                  {a.severidad}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  a.verificada ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {a.verificada ? "Verificada" : "Sin verificar"}
                </span>
                <span className="text-gray-400 text-xs ml-auto whitespace-nowrap">{a.detectada_at?.substring(0, 10)}</span>
              </summary>

              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
                <form action={updateAlerta.bind(null, a.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
                    <select name="tipo" defaultValue={a.tipo} className={INPUT + " w-full"}>
                      <option value="patrimonio_injustificado">Patrimonio injustificado</option>
                      <option value="conflicto_interes">Conflicto de interes</option>
                      <option value="antecedente_grave">Antecedente grave</option>
                      <option value="financiacion_sospechosa">Financiacion sospechosa</option>
                      <option value="vinculo_sospechoso">Vinculo sospechoso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Severidad</label>
                    <select name="severidad" defaultValue={a.severidad} className={INPUT + " w-full"}>
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Descripcion</label>
                    <textarea name="descripcion" defaultValue={a.descripcion ?? ""} rows={3} className={INPUT + " w-full"} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Verificada</label>
                    <select name="verificada" defaultValue={a.verificada ? "true" : "false"} className={INPUT + " w-full"}>
                      <option value="true">Si</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                      Guardar cambios
                    </button>
                    <form action={deleteAlerta.bind(null, a.id)} className="inline">
                      <button type="submit" className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </form>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
