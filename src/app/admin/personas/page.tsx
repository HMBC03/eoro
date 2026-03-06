import { createClient } from "@/lib/supabase/server";
import { createPersona, updatePersona, deletePersona } from "../actions";

export default async function AdminPersonasPage() {
  const supabase = await createClient();
  const { data: personas } = await supabase
    .schema("eoro")
    .from("personas")
    .select("id, nombre_completo, cedula, tipo, departamento_origen")
    .order("nombre_completo");

  const rows = personas ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear persona
        </summary>
        <form action={createPersona} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="nombre_completo" placeholder="Nombre completo *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="cedula" placeholder="Cedula *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="candidato">Candidato</option>
            <option value="funcionario">Funcionario</option>
            <option value="contratista">Contratista</option>
            <option value="civil">Civil</option>
          </select>
          <input name="departamento_origen" placeholder="Departamento" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <textarea name="biografia" placeholder="Biografia" rows={2} className="sm:col-span-2 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
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
              <th className="px-5 py-3">Cedula</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Departamento</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{p.nombre_completo}</td>
                <td className="px-5 py-3 text-gray-500">{p.cedula}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    p.tipo === "candidato" ? "bg-blue-50 text-blue-700" :
                    p.tipo === "funcionario" ? "bg-emerald-50 text-emerald-700" :
                    p.tipo === "contratista" ? "bg-amber-50 text-amber-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {p.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{p.departamento_origen}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deletePersona.bind(null, p.id)} className="inline">
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
