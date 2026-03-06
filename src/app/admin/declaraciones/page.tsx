import { createClient } from "@/lib/supabase/server";
import { createDeclaracion, deleteDeclaracion } from "../actions-detail";

export default async function AdminDeclaracionesPage() {
  const supabase = await createClient();

  const [{ data: declaraciones }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("declaraciones_patrimonio")
      .select("*, personas(nombre_completo)")
      .order("anio", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (declaraciones ?? []) as unknown as {
    id: string;
    persona_id: string;
    anio: number;
    patrimonio_total: number;
    ingresos_total: number;
    bienes_inmuebles_valor: number;
    vehiculos_valor: number;
    cuentas_bancarias_saldo: number;
    personas: { nombre_completo: string };
  }[];

  const personasList = personas ?? [];

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Declaraciones de Patrimonio</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear declaracion
        </summary>
        <form action={createDeclaracion} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="persona_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Persona *</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
          <input name="anio" type="number" placeholder="Ano *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="patrimonio_total" type="number" placeholder="Patrimonio total *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="ingresos_total" type="number" placeholder="Ingresos total *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="bienes_inmuebles_valor" type="number" placeholder="Bienes inmuebles" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="vehiculos_valor" type="number" placeholder="Vehiculos" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="cuentas_bancarias_saldo" type="number" placeholder="Cuentas bancarias" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Ano</th>
              <th className="px-5 py-3">Patrimonio</th>
              <th className="px-5 py-3">Ingresos</th>
              <th className="px-5 py-3">Inmuebles</th>
              <th className="px-5 py-3">Vehiculos</th>
              <th className="px-5 py-3">Cuentas</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{d.personas?.nombre_completo}</td>
                <td className="px-5 py-3 text-gray-500">{d.anio}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(d.patrimonio_total)}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(d.ingresos_total)}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(d.bienes_inmuebles_valor)}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(d.vehiculos_valor)}</td>
                <td className="px-5 py-3 text-gray-500">{fmt(d.cuentas_bancarias_saldo)}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteDeclaracion.bind(null, d.id)} className="inline">
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
