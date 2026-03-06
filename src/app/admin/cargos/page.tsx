import { createClient } from "@/lib/supabase/server";
import { createCargo, deleteCargo } from "../actions-political";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cargos Publicos</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear cargo
        </summary>
        <form action={createCargo} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="persona_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Persona *</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
          <input name="cargo" placeholder="Cargo *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="entidad" placeholder="Entidad *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="departamento" placeholder="Departamento" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="municipio" placeholder="Municipio" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="fecha_inicio" type="date" placeholder="Fecha inicio" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="fecha_fin" type="date" placeholder="Fecha fin" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <select name="nivel" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Nivel</option>
            <option value="nacional">Nacional</option>
            <option value="departamental">Departamental</option>
            <option value="municipal">Municipal</option>
          </select>
          <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            Crear
          </button>
        </form>
      </details>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
              <th className="px-5 py-3">Persona</th>
              <th className="px-5 py-3">Cargo</th>
              <th className="px-5 py-3">Entidad</th>
              <th className="px-5 py-3">Depto</th>
              <th className="px-5 py-3">Nivel</th>
              <th className="px-5 py-3">Inicio</th>
              <th className="px-5 py-3">Fin</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{c.personas?.nombre_completo}</td>
                <td className="px-5 py-3 text-gray-500">{c.cargo}</td>
                <td className="px-5 py-3 text-gray-500">{c.entidad}</td>
                <td className="px-5 py-3 text-gray-500">{c.departamento}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    c.nivel === "nacional" ? "bg-blue-50 text-blue-700" :
                    c.nivel === "departamental" ? "bg-purple-50 text-purple-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {c.nivel}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{c.fecha_inicio}</td>
                <td className="px-5 py-3 text-gray-500">{c.fecha_fin ?? "Actual"}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteCargo.bind(null, c.id)} className="inline">
                    <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-medium">
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
