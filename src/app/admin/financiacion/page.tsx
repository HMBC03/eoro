import { createClient } from "@/lib/supabase/server";
import { createFinanciacion, deleteFinanciacion } from "../actions-detail";

export default async function AdminFinanciacionPage() {
  const supabase = await createClient();

  const [{ data: financiacion }, { data: candidaturas }, { data: personas }] =
    await Promise.all([
      supabase
        .schema("eoro")
        .from("financiacion_campana")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .schema("eoro")
        .from("candidaturas")
        .select("id, persona_id, tipo, eleccion_year")
        .order("eleccion_year", { ascending: false }),
      supabase
        .schema("eoro")
        .from("personas")
        .select("id, nombre_completo")
        .order("nombre_completo"),
    ]);

  const rows = (financiacion ?? []) as unknown as {
    id: string;
    candidatura_id: string;
    tipo: string;
    concepto: string;
    valor: number;
    aportante_nombre: string;
    aportante_tipo: string;
  }[];

  const candidaturasList = candidaturas ?? [];
  const personasList = personas ?? [];
  const personaMap = new Map(personasList.map((p) => [p.id, p.nombre_completo]));

  // Build candidatura display labels
  const candidaturaOptions = candidaturasList.map((c) => ({
    id: c.id,
    label: `${personaMap.get(c.persona_id) ?? "?"} - ${c.tipo} - ${c.eleccion_year}`,
  }));

  const candidaturaMap = new Map(candidaturaOptions.map((c) => [c.id, c.label]));

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financiacion de Campana</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear registro de financiacion
        </summary>
        <form action={createFinanciacion} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="candidatura_id" required className="sm:col-span-2 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Candidatura *</option>
            {candidaturaOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
          <input name="concepto" placeholder="Concepto *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="valor" type="number" placeholder="Valor *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="aportante_nombre" placeholder="Nombre aportante *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <select name="aportante_tipo" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo aportante</option>
            <option value="propio">Propio</option>
            <option value="familiar">Familiar</option>
            <option value="particular">Particular</option>
            <option value="empresa">Empresa</option>
            <option value="estatal">Estatal</option>
            <option value="credito">Credito</option>
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
              <th className="px-5 py-3">Candidatura</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Concepto</th>
              <th className="px-5 py-3">Valor</th>
              <th className="px-5 py-3">Aportante</th>
              <th className="px-5 py-3">Tipo Aportante</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900 max-w-[200px] truncate">{candidaturaMap.get(f.candidatura_id) ?? f.candidatura_id}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    f.tipo === "ingreso" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}>
                    {f.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{f.concepto}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(f.valor)}</td>
                <td className="px-5 py-3 text-gray-500">{f.aportante_nombre}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-gray-100 text-gray-500 px-2 py-0.5 text-[10px] font-semibold">
                    {f.aportante_tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteFinanciacion.bind(null, f.id)} className="inline">
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
