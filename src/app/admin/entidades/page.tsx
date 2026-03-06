import { createClient } from "@/lib/supabase/server";
import { createEntidad, deleteEntidad } from "../actions-presupuesto";

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
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear entidad
        </summary>
        <form action={createEntidad} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="rama_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Rama *</option>
            {ramasList.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
          <input name="nombre" placeholder="Nombre *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="ministerio">Ministerio</option>
            <option value="departamento_admin">Departamento administrativo</option>
            <option value="corporacion">Corporacion</option>
            <option value="corte">Corte</option>
            <option value="organo_control">Organo de control</option>
            <option value="otro">Otro</option>
          </select>
          <input name="presupuesto_asignado" type="number" placeholder="Presupuesto asignado *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="ejecutado" type="number" placeholder="Ejecutado" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="porcentaje_ejecucion" type="number" step="0.01" placeholder="% Ejecucion" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Rama</th>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Presupuesto</th>
              <th className="px-5 py-3">Ejecutado</th>
              <th className="px-5 py-3">% Ejec.</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-500">{e.ramas_gobierno?.nombre}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{e.nombre}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">
                    {e.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{fmt(e.presupuesto_asignado)}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(e.ejecutado)}</td>
                <td className="px-5 py-3 text-gray-500">{e.porcentaje_ejecucion}%</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteEntidad.bind(null, e.id)} className="inline">
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
