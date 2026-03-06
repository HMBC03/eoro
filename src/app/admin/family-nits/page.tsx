import { createClient } from "@/lib/supabase/server";
import { createFamilyNit, deleteFamilyNit } from "../actions-grafos";

export default async function AdminFamilyNitsPage() {
  const supabase = await createClient();
  const { data: nits } = await supabase
    .schema("eoro")
    .from("family_nits")
    .select("*")
    .order("nit");

  const rows = (nits ?? []) as unknown as {
    id: string;
    nit: string;
  }[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family NITs</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear NIT
        </summary>
        <form action={createFamilyNit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="nit" placeholder="NIT *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">NIT</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => (
              <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-400 text-xs font-mono">{n.id.slice(0, 8)}...</td>
                <td className="px-5 py-3 font-medium text-gray-900">{n.nit}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteFamilyNit.bind(null, n.id)} className="inline">
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
