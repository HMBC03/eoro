import { createClient } from "@/lib/supabase/server";
import { createScore, deleteScore } from "../actions-presupuesto";

export default async function AdminScoresPage() {
  const supabase = await createClient();

  const [{ data: scores }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("scores_transparencia")
      .select("*, personas(nombre_completo)")
      .order("total", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (scores ?? []) as unknown as {
    id: string;
    persona_id: string;
    total: number;
    financiacion_reportada: number;
    sin_antecedentes_disciplinarios: number;
    sin_responsabilidad_fiscal: number;
    declaro_bienes: number;
    crecimiento_patrimonial_razonable: number;
    sin_familiares_vinculados: number;
    sin_cambios_partido: number;
    reporto_conflictos: number;
    personas: { nombre_completo: string };
  }[];

  const personasList = personas ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scores de Transparencia</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear score
        </summary>
        <form action={createScore} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="persona_id" required className="sm:col-span-2 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Persona *</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
          <input name="total" type="number" placeholder="Total *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="financiacion_reportada" type="number" placeholder="Financiacion reportada" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="sin_antecedentes_disciplinarios" type="number" placeholder="Sin antec. disciplinarios" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="sin_responsabilidad_fiscal" type="number" placeholder="Sin resp. fiscal" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="declaro_bienes" type="number" placeholder="Declaro bienes" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="crecimiento_patrimonial_razonable" type="number" placeholder="Crecimiento patrimonial razonable" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="sin_familiares_vinculados" type="number" placeholder="Sin familiares vinculados" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="sin_cambios_partido" type="number" placeholder="Sin cambios de partido" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="reporto_conflictos" type="number" placeholder="Reporto conflictos" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Financ.</th>
              <th className="px-5 py-3">Discipl.</th>
              <th className="px-5 py-3">Fiscal</th>
              <th className="px-5 py-3">Bienes</th>
              <th className="px-5 py-3">Patrim.</th>
              <th className="px-5 py-3">Fam.</th>
              <th className="px-5 py-3">Partido</th>
              <th className="px-5 py-3">Confl.</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{s.personas?.nombre_completo}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    s.total >= 80 ? "bg-emerald-50 text-emerald-700" :
                    s.total >= 50 ? "bg-amber-50 text-amber-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {s.total}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{s.financiacion_reportada}</td>
                <td className="px-5 py-3 text-gray-500">{s.sin_antecedentes_disciplinarios}</td>
                <td className="px-5 py-3 text-gray-500">{s.sin_responsabilidad_fiscal}</td>
                <td className="px-5 py-3 text-gray-500">{s.declaro_bienes}</td>
                <td className="px-5 py-3 text-gray-500">{s.crecimiento_patrimonial_razonable}</td>
                <td className="px-5 py-3 text-gray-500">{s.sin_familiares_vinculados}</td>
                <td className="px-5 py-3 text-gray-500">{s.sin_cambios_partido}</td>
                <td className="px-5 py-3 text-gray-500">{s.reporto_conflictos}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteScore.bind(null, s.id)} className="inline">
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
