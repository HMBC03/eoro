import { createClient } from "@/lib/supabase/server";
import { createVinculo, deleteVinculo } from "../actions-detail";

export default async function AdminVinculosPage() {
  const supabase = await createClient();

  const [{ data: vinculos }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("vinculos_familiares")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (vinculos ?? []) as unknown as {
    id: string;
    persona_a_id: string;
    persona_b_id: string;
    parentesco: string;
    verificado: boolean;
    fuente: string;
  }[];

  const personasList = personas ?? [];
  const personaMap = new Map(personasList.map((p) => [p.id, p.nombre_completo]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vinculos Familiares</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear vinculo
        </summary>
        <form action={createVinculo} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="persona_a_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Persona A *</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
          <select name="persona_b_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Persona B *</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
          <input name="parentesco" placeholder="Parentesco *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="fuente" placeholder="Fuente" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input name="verificado" type="checkbox" value="true" className="rounded" />
            Verificado
          </label>
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
              <th className="px-5 py-3">Persona A</th>
              <th className="px-5 py-3">Persona B</th>
              <th className="px-5 py-3">Parentesco</th>
              <th className="px-5 py-3">Verificado</th>
              <th className="px-5 py-3">Fuente</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{personaMap.get(v.persona_a_id) ?? v.persona_a_id}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{personaMap.get(v.persona_b_id) ?? v.persona_b_id}</td>
                <td className="px-5 py-3 text-gray-500">{v.parentesco}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    v.verificado ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {v.verificado ? "Si" : "No"}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{v.fuente}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteVinculo.bind(null, v.id)} className="inline">
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
