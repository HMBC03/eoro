import { createClient } from "@/lib/supabase/server";
import { createCandidatura, deleteCandidatura } from "../actions-political";

export default async function AdminCandidaturasPage() {
  const supabase = await createClient();

  const [{ data: candidaturas }, { data: personas }, { data: partidos }] =
    await Promise.all([
      supabase
        .schema("eoro")
        .from("candidaturas")
        .select("*, personas(nombre_completo), partidos(nombre)")
        .order("eleccion_year", { ascending: false }),
      supabase
        .schema("eoro")
        .from("personas")
        .select("id, nombre_completo")
        .order("nombre_completo"),
      supabase
        .schema("eoro")
        .from("partidos")
        .select("id, nombre")
        .order("nombre"),
    ]);

  const rows = (candidaturas ?? []) as unknown as {
    id: string;
    persona_id: string;
    partido_id: string;
    tipo: string;
    eleccion_year: number;
    circunscripcion: string;
    estado: string;
    elegido: boolean;
    personas: { nombre_completo: string };
    partidos: { nombre: string };
  }[];

  const personasList = personas ?? [];
  const partidosList = partidos ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidaturas</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="rounded-2xl bg-white border border-gray-100 p-5">
        <summary className="text-sm font-bold text-gray-900 cursor-pointer">
          + Crear candidatura
        </summary>
        <form action={createCandidatura} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="persona_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Persona *</option>
            {personasList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
          <select name="partido_id" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Partido *</option>
            {partidosList.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <select name="tipo" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Tipo *</option>
            <option value="presidencia">Presidencia</option>
            <option value="senado">Senado</option>
            <option value="camara">Camara</option>
            <option value="gobernacion">Gobernacion</option>
            <option value="alcaldia">Alcaldia</option>
            <option value="concejo">Concejo</option>
            <option value="asamblea">Asamblea</option>
          </select>
          <input name="eleccion_year" type="number" placeholder="Ano eleccion *" required className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <input name="circunscripcion" placeholder="Circunscripcion" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          <select name="estado" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            <option value="">Estado</option>
            <option value="inscrito">Inscrito</option>
            <option value="retirado">Retirado</option>
            <option value="inhabilitado">Inhabilitado</option>
            <option value="electo">Electo</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input name="elegido" type="checkbox" className="rounded" />
            Elegido
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
              <th className="px-5 py-3">Persona</th>
              <th className="px-5 py-3">Partido</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Ano</th>
              <th className="px-5 py-3">Circunscripcion</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Elegido</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{c.personas?.nombre_completo}</td>
                <td className="px-5 py-3 text-gray-500">{c.partidos?.nombre}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">
                    {c.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{c.eleccion_year}</td>
                <td className="px-5 py-3 text-gray-500">{c.circunscripcion}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    c.estado === "electo" ? "bg-emerald-50 text-emerald-700" :
                    c.estado === "inhabilitado" ? "bg-red-50 text-red-700" :
                    c.estado === "retirado" ? "bg-amber-50 text-amber-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{c.elegido ? "Si" : "No"}</td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteCandidatura.bind(null, c.id)} className="inline">
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
