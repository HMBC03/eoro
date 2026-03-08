import { createClient } from "@/lib/supabase/server";
import { updateVariable } from "../actions-eoro";

const FUENTE_STYLES: Record<string, string> = {
  oficial: "bg-blue-50 text-blue-700",
  judicial: "bg-purple-50 text-purple-700",
  periodistica: "bg-amber-50 text-amber-700",
  ciudadana: "bg-emerald-50 text-emerald-700",
  electoral: "bg-rose-50 text-rose-700",
};

export default async function EoroVariablesPage() {
  const supabase = await createClient();
  const INPUT =
    "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const [{ data: categorias }, { data: variables }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("eoro_categorias")
      .select("*")
      .order("orden"),
    supabase
      .schema("eoro")
      .from("eoro_variables")
      .select("*")
      .order("orden"),
  ]);

  const cats = (categorias ?? []) as Array<{
    id: string;
    nombre: string;
    slug: string;
    peso_max: number;
    descripcion: string;
    orden: number;
  }>;

  const vars = (variables ?? []) as Array<{
    id: string;
    categoria_id: string;
    nombre: string;
    slug: string;
    penalizacion: number;
    condicion: string;
    fuente_tipo: string;
    activa: boolean;
    orden: number;
  }>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        Variables Eoro
      </h1>
      <p className="text-xs text-gray-400 mb-6">
        {vars.length} variables en {cats.length} categorias — editable
      </p>

      <div className="space-y-6">
        {cats.map((cat) => {
          const catVars = vars.filter((v) => v.categoria_id === cat.id);
          const totalPenalizacion = catVars.reduce(
            (s, v) => s + v.penalizacion,
            0
          );

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-gray-200 bg-white"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {cat.nombre}
                  </h2>
                  <p className="text-[10px] text-gray-400">
                    {cat.descripcion}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-900">
                    Max -{cat.peso_max}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Sum: -{totalPenalizacion}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {catVars.map((v) => (
                  <details key={v.id} className="group">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                            v.activa
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          -{v.penalizacion}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`text-sm truncate ${
                              v.activa
                                ? "text-gray-900"
                                : "text-gray-400 line-through"
                            }`}
                          >
                            {v.nombre}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {v.condicion}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                            FUENTE_STYLES[v.fuente_tipo] ??
                            "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {v.fuente_tipo}
                        </span>
                        {!v.activa && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] text-gray-500">
                            inactiva
                          </span>
                        )}
                      </div>
                    </summary>

                    <form
                      action={updateVariable.bind(null, v.id)}
                      className="border-t border-gray-50 px-5 pb-3 pt-2"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          name="nombre"
                          defaultValue={v.nombre}
                          placeholder="Nombre"
                          className={INPUT}
                        />
                        <input
                          name="penalizacion"
                          type="number"
                          min="1"
                          max="25"
                          defaultValue={v.penalizacion}
                          className={INPUT}
                        />
                        <input
                          name="condicion"
                          defaultValue={v.condicion}
                          placeholder="Condicion"
                          className={`${INPUT} sm:col-span-2`}
                        />
                        <select
                          name="activa"
                          defaultValue={String(v.activa)}
                          className={INPUT}
                        >
                          <option value="true">Activa</option>
                          <option value="false">Inactiva</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="mt-3 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                      >
                        Guardar
                      </button>
                    </form>
                  </details>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
