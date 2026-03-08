import { createClient } from "@/lib/supabase/server";
import { updateReporteEstado, deleteReporte } from "../actions-eoro";

const ESTADO_STYLES: Record<string, string> = {
  pendiente: "bg-yellow-50 text-yellow-700",
  en_revision: "bg-blue-50 text-blue-700",
  verificado: "bg-emerald-50 text-emerald-700",
  rechazado: "bg-red-50 text-red-600",
  duplicado: "bg-gray-100 text-gray-500",
};

const ESTADOS = [
  "pendiente",
  "en_revision",
  "verificado",
  "rechazado",
  "duplicado",
];

export default async function EoroReportesPage() {
  const supabase = await createClient();
  const INPUT =
    "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const { data: reportes } = await supabase
    .schema("eoro")
    .from("eoro_reportes_ciudadanos")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (reportes ?? []) as Array<{
    id: string;
    persona_id: string;
    reportante_hash: string;
    descripcion: string;
    evidencia_urls: string[];
    estado: string;
    verificado_por: string | null;
    verificado_at: string | null;
    fuentes_verificacion: string[];
    impacto_score: number;
    notas_internas: string;
    created_at: string;
  }>;

  // Get persona names
  const personaIds = [...new Set(rows.map((r) => r.persona_id))];
  const { data: personas } =
    personaIds.length > 0
      ? await supabase
          .schema("eoro")
          .from("personas")
          .select("id, nombre_completo")
          .in("id", personaIds)
      : { data: [] };

  const personaMap = new Map(
    (personas ?? []).map((p: { id: string; nombre_completo: string }) => [
      p.id,
      p.nombre_completo,
    ])
  );

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        Reportes Ciudadanos
      </h1>
      <p className="text-xs text-gray-400 mb-6">
        {rows.length} reporte{rows.length !== 1 ? "s" : ""} —{" "}
        {rows.filter((r) => r.estado === "pendiente").length} pendientes
      </p>

      {rows.length === 0 && (
        <div className="rounded-2xl bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-400">
            No hay reportes ciudadanos aun
          </p>
        </div>
      )}

      <div className="space-y-2">
        {rows.map((r) => (
          <details
            key={r.id}
            className="group rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {personaMap.get(r.persona_id) ?? "Persona desconocida"}
                </p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                  {r.descripcion.slice(0, 80)}
                  {r.descripcion.length > 80 ? "..." : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {r.impacto_score > 0 && (
                  <span className="text-[10px] font-bold text-red-500">
                    -{r.impacto_score}
                  </span>
                )}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    ESTADO_STYLES[r.estado] ?? "bg-gray-100 text-gray-500"
                  }`}
                >
                  {r.estado}
                </span>
                <span className="text-[10px] text-gray-400">
                  {r.created_at.slice(0, 10)}
                </span>
              </div>
            </summary>

            <div className="border-t border-gray-50 px-5 pb-4 pt-3">
              {/* Report details */}
              <div className="mb-4 space-y-2">
                <p className="text-sm text-gray-700">{r.descripcion}</p>
                {r.evidencia_urls.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase mb-1">
                      Evidencia
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {r.evidencia_urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] text-blue-600 hover:bg-blue-100 truncate max-w-[200px]"
                        >
                          Link {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {r.verificado_por && (
                  <p className="text-[10px] text-gray-400">
                    Verificado por {r.verificado_por} —{" "}
                    {r.verificado_at?.slice(0, 10)}
                  </p>
                )}
              </div>

              {/* Verification form */}
              <form
                action={updateReporteEstado.bind(
                  null,
                  r.id,
                  r.persona_id
                )}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <select
                    name="estado"
                    defaultValue={r.estado}
                    className={INPUT}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                  <input
                    name="impacto_score"
                    type="number"
                    min="0"
                    max="15"
                    defaultValue={r.impacto_score}
                    placeholder="Impacto score (0-15)"
                    className={INPUT}
                  />
                  <input
                    name="notas_internas"
                    defaultValue={r.notas_internas}
                    placeholder="Notas internas"
                    className={INPUT}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    Guardar
                  </button>
                  <form
                    action={deleteReporte.bind(null, r.id)}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
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
