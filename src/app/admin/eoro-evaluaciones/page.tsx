import { createClient } from "@/lib/supabase/server";
import {
  createEvaluacion,
  updateEvaluacion,
  deleteEvaluacion,
  recalculateAllScores,
} from "../actions-eoro";

export default async function EoroEvaluacionesPage() {
  const supabase = await createClient();
  const INPUT =
    "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const [{ data: evaluaciones }, { data: personas }, { data: variables }, { data: categorias }] =
    await Promise.all([
      supabase
        .schema("eoro")
        .from("eoro_evaluaciones")
        .select("*, eoro_variables(nombre, slug, categoria_id, eoro_categorias(nombre))")
        .order("created_at", { ascending: false }),
      supabase
        .schema("eoro")
        .from("personas")
        .select("id, nombre_completo")
        .order("nombre_completo"),
      supabase
        .schema("eoro")
        .from("eoro_variables")
        .select("id, nombre, slug, penalizacion, categoria_id, eoro_categorias(nombre)")
        .eq("activa", true)
        .order("orden"),
      supabase
        .schema("eoro")
        .from("eoro_categorias")
        .select("id, nombre, slug")
        .order("orden"),
    ]);

  const rows = (evaluaciones ?? []) as Array<{
    id: string;
    persona_id: string;
    variable_id: string;
    puntos_restados: number;
    evidencia_url: string;
    fuente_descripcion: string;
    fecha_deteccion: string;
    fecha_resolucion: string | null;
    resolucion_tipo: string | null;
    notas: string;
    eoro_variables: {
      nombre: string;
      slug: string;
      categoria_id: string;
      eoro_categorias: { nombre: string };
    } | null;
  }>;

  const personaMap = new Map(
    (personas ?? []).map((p: { id: string; nombre_completo: string }) => [
      p.id,
      p.nombre_completo,
    ])
  );

  const RESOLUCION_TYPES = ["", "absuelto", "prescrito", "archivado", "anulado", "vigente"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Evaluaciones Eoro
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {rows.length} evaluacion{rows.length !== 1 ? "es" : ""} registradas
          </p>
        </div>
        <form action={recalculateAllScores}>
          <button
            type="submit"
            className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Recalcular todos
          </button>
        </form>
      </div>

      {/* Create form */}
      <details className="group/create mb-6 rounded-2xl border border-gray-200 bg-white">
        <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-gray-700">
          + Nueva evaluacion
        </summary>
        <form action={createEvaluacion} className="px-5 pb-5 pt-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="persona_id" required className={INPUT}>
              <option value="">Persona...</option>
              {(personas ?? []).map((p: { id: string; nombre_completo: string }) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_completo}
                </option>
              ))}
            </select>
            <select name="variable_id" required className={INPUT}>
              <option value="">Variable...</option>
              {(categorias ?? []).map(
                (cat: { id: string; nombre: string; slug: string }) => (
                  <optgroup key={cat.id} label={cat.nombre}>
                    {(variables ?? [])
                      .filter(
                        (v: { categoria_id: string }) =>
                          v.categoria_id === cat.id
                      )
                      .map(
                        (v: {
                          id: string;
                          nombre: string;
                          penalizacion: number;
                        }) => (
                          <option key={v.id} value={v.id}>
                            {v.nombre} (-{v.penalizacion})
                          </option>
                        )
                      )}
                  </optgroup>
                )
              )}
            </select>
            <input
              name="puntos_restados"
              type="number"
              min="0"
              max="25"
              placeholder="Puntos a restar"
              className={INPUT}
              required
            />
            <input
              name="fecha_deteccion"
              type="date"
              className={INPUT}
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
            <input
              name="evidencia_url"
              placeholder="URL evidencia"
              className={INPUT}
            />
            <input
              name="fuente_descripcion"
              placeholder="Descripcion fuente"
              className={INPUT}
            />
            <textarea
              name="notas"
              placeholder="Notas..."
              rows={2}
              className={`${INPUT} sm:col-span-2`}
            />
          </div>
          <button
            type="submit"
            className="mt-3 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Crear evaluacion
          </button>
        </form>
      </details>

      {/* List */}
      <div className="space-y-2">
        {rows.map((ev) => (
          <details
            key={ev.id}
            className="group rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-600">
                  -{ev.puntos_restados}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {personaMap.get(ev.persona_id) ?? "—"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {ev.eoro_variables?.eoro_categorias?.nombre} →{" "}
                    {ev.eoro_variables?.nombre}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {ev.resolucion_tipo && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    {ev.resolucion_tipo}
                  </span>
                )}
                <span className="text-[10px] text-gray-400">
                  {ev.fecha_deteccion}
                </span>
              </div>
            </summary>
            <form
              action={updateEvaluacion.bind(null, ev.id)}
              className="border-t border-gray-50 px-5 pb-4 pt-3"
            >
              <input type="hidden" name="persona_id" value={ev.persona_id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="variable_id"
                  defaultValue={ev.variable_id}
                  className={INPUT}
                >
                  {(categorias ?? []).map(
                    (cat: { id: string; nombre: string }) => (
                      <optgroup key={cat.id} label={cat.nombre}>
                        {(variables ?? [])
                          .filter(
                            (v: { categoria_id: string }) =>
                              v.categoria_id === cat.id
                          )
                          .map(
                            (v: {
                              id: string;
                              nombre: string;
                              penalizacion: number;
                            }) => (
                              <option key={v.id} value={v.id}>
                                {v.nombre} (-{v.penalizacion})
                              </option>
                            )
                          )}
                      </optgroup>
                    )
                  )}
                </select>
                <input
                  name="puntos_restados"
                  type="number"
                  min="0"
                  max="25"
                  defaultValue={ev.puntos_restados}
                  className={INPUT}
                />
                <input
                  name="fecha_deteccion"
                  type="date"
                  defaultValue={ev.fecha_deteccion}
                  className={INPUT}
                />
                <input
                  name="fecha_resolucion"
                  type="date"
                  defaultValue={ev.fecha_resolucion ?? ""}
                  placeholder="Fecha resolucion"
                  className={INPUT}
                />
                <select
                  name="resolucion_tipo"
                  defaultValue={ev.resolucion_tipo ?? ""}
                  className={INPUT}
                >
                  {RESOLUCION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t || "— Sin resolucion —"}
                    </option>
                  ))}
                </select>
                <input
                  name="evidencia_url"
                  defaultValue={ev.evidencia_url}
                  placeholder="URL evidencia"
                  className={INPUT}
                />
                <input
                  name="fuente_descripcion"
                  defaultValue={ev.fuente_descripcion}
                  placeholder="Fuente"
                  className={INPUT}
                />
                <textarea
                  name="notas"
                  defaultValue={ev.notas}
                  rows={2}
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
                  action={deleteEvaluacion.bind(
                    null,
                    ev.id,
                    ev.persona_id
                  )}
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
          </details>
        ))}
      </div>
    </div>
  );
}
