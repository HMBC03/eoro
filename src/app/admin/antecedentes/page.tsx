import { createClient } from "@/lib/supabase/server";
import { createAntecedente, deleteAntecedente } from "../actions-detail";

export default async function AdminAntecedentesPage() {
  const supabase = await createClient();

  const [{ data: antecedentes }, { data: personas }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("antecedentes")
      .select("*, personas(nombre_completo)")
      .order("created_at", { ascending: false }),
    supabase
      .schema("eoro")
      .from("personas")
      .select("id, nombre_completo")
      .order("nombre_completo"),
  ]);

  const rows = (antecedentes ?? []) as unknown as {
    id: string;
    persona_id: string;
    tipo: string;
    estado: string;
    descripcion: string;
    entidad_reporta: string;
    fecha_sancion: string | null;
    fecha_vencimiento: string | null;
    personas: { nombre_completo: string };
  }[];

  const personasList = personas ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Antecedentes</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear antecedente
        </summary>
        <form action={createAntecedente} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="persona_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Persona *</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="disciplinario">Disciplinario</option>
            <option value="fiscal">Fiscal</option>
            <option value="penal">Penal</option>
            <option value="perdida_investidura">Perdida de investidura</option>
          </select>
          <select name="estado" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Estado *</option>
            <option value="vigente">Vigente</option>
            <option value="archivado">Archivado</option>
            <option value="sancionado">Sancionado</option>
            <option value="absuelto">Absuelto</option>
          </select>
          <input name="entidad_reporta" placeholder="Entidad que reporta" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="fecha_sancion" type="date" placeholder="Fecha sancion" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="fecha_vencimiento" type="date" placeholder="Fecha vencimiento" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <textarea name="descripcion" placeholder="Descripcion" rows={2} className="sm:col-span-2 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Entidad</th>
              <th className="px-5 py-3">Sancion</th>
              <th className="px-5 py-3">Vencimiento</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{a.personas?.nombre_completo}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    a.tipo === "penal" ? "bg-red-50 text-red-700" :
                    a.tipo === "fiscal" ? "bg-amber-50 text-amber-700" :
                    a.tipo === "disciplinario" ? "bg-blue-50 text-blue-700" :
                    "bg-purple-50 text-purple-700"
                  }`}>
                    {a.tipo}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    a.estado === "vigente" ? "bg-red-50 text-red-700" :
                    a.estado === "sancionado" ? "bg-amber-50 text-amber-700" :
                    a.estado === "absuelto" ? "bg-emerald-50 text-emerald-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {a.estado}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{a.entidad_reporta}</td>
                <td className="px-5 py-3 text-gray-500">{a.fecha_sancion}</td>
                <td className="px-5 py-3 text-gray-500">{a.fecha_vencimiento}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteAntecedente.bind(null, a.id)} className="inline">
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
