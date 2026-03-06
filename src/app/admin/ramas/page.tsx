import { createClient } from "@/lib/supabase/server";
import { createRama, deleteRama } from "../actions-presupuesto";

export default async function AdminRamasPage() {
  const supabase = await createClient();
  const { data: ramas } = await supabase
    .schema("eoro")
    .from("ramas_gobierno")
    .select("*")
    .order("nombre");

  const rows = (ramas ?? []) as unknown as {
    id: string;
    nombre: string;
    presupuesto_total: number;
    porcentaje_pgn: number;
  }[];

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ramas de Gobierno</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear rama
        </summary>
        <form action={createRama} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="nombre" placeholder="Nombre *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="presupuesto_total" type="number" placeholder="Presupuesto total *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="porcentaje_pgn" type="number" step="0.01" placeholder="% PGN *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Presupuesto Total</th>
              <th className="px-5 py-3">% PGN</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{r.nombre}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(r.presupuesto_total)}</td>
                <td className="px-5 py-3 text-gray-500">{r.porcentaje_pgn}%</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteRama.bind(null, r.id)} className="inline">
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
