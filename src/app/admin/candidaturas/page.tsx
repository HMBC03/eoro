import { createClient } from "@/lib/supabase/server";
import { createCandidatura, updateCandidatura, deleteCandidatura } from "../actions-political";

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
    votos_obtenidos: number;
    personas: { nombre_completo: string };
    partidos: { nombre: string };
  }[];

  const personasList = personas ?? [];
  const partidosList = partidos ?? [];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidaturas</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Create form */}
      <details className="group/create rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-white group-open/create:bg-[#c4e615] group-open/create:text-gray-900 transition-colors shrink-0">
            <svg className="h-4 w-4 transition-transform group-open/create:rotate-45" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Crear candidatura</p>
            <p className="text-[11px] text-gray-400">Asocia una persona con una candidatura</p>
          </div>
        </summary>
        <form action={createCandidatura} className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona</label>
            <select name="persona_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar persona...</option>
              {personasList.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre_completo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Partido</label>
            <select name="partido_id" required className={INPUT + " w-full"}>
              <option value="">Seleccionar partido...</option>
              {partidosList.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
            <select name="tipo" required className={INPUT + " w-full"}>
              <option value="">Seleccionar tipo...</option>
              <option value="presidencia">Presidencia</option>
              <option value="senado">Senado</option>
              <option value="camara">Camara</option>
              <option value="gobernacion">Gobernacion</option>
              <option value="alcaldia">Alcaldia</option>
              <option value="concejo">Concejo</option>
              <option value="asamblea">Asamblea</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ano eleccion</label>
            <input name="eleccion_year" type="number" placeholder="Ej: 2026" required className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Circunscripcion</label>
            <input name="circunscripcion" placeholder="Ej: Bogota D.C." className={INPUT + " w-full"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Estado</label>
            <select name="estado" className={INPUT + " w-full"}>
              <option value="">Seleccionar estado...</option>
              <option value="inscrito">Inscrito</option>
              <option value="retirado">Retirado</option>
              <option value="inhabilitado">Inhabilitado</option>
              <option value="electo">Electo</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="elegido" value="true" className="rounded border-gray-300" />
            <label className="text-xs text-gray-600">Elegido</label>
          </div>
          <div className="sm:col-span-2 pt-1">
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all">
              Crear candidatura
            </button>
          </div>
        </form>
      </details>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((c) => (
          <details key={c.id} className="group rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <summary className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900 min-w-[150px]">{c.personas?.nombre_completo}</span>
              <span className="text-gray-500 text-xs">{c.partidos?.nombre}</span>
              <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">
                {c.tipo}
              </span>
              <span className="text-gray-500 text-xs">{c.eleccion_year}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                c.estado === "electo" ? "bg-emerald-50 text-emerald-700" :
                c.estado === "inhabilitado" ? "bg-red-50 text-red-700" :
                c.estado === "retirado" ? "bg-amber-50 text-amber-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {c.estado}
              </span>
              <span className="text-gray-400 text-xs ml-auto">{c.elegido ? "Elegido" : ""}</span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30">
              <form action={updateCandidatura.bind(null, c.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Persona</label>
                  <select name="persona_id" defaultValue={c.persona_id} required className={INPUT + " w-full"}>
                    {personasList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Partido</label>
                  <select name="partido_id" defaultValue={c.partido_id} required className={INPUT + " w-full"}>
                    {partidosList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Tipo</label>
                  <select name="tipo" defaultValue={c.tipo} required className={INPUT + " w-full"}>
                    <option value="presidencia">Presidencia</option>
                    <option value="senado">Senado</option>
                    <option value="camara">Camara</option>
                    <option value="gobernacion">Gobernacion</option>
                    <option value="alcaldia">Alcaldia</option>
                    <option value="concejo">Concejo</option>
                    <option value="asamblea">Asamblea</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Ano eleccion</label>
                  <input name="eleccion_year" type="number" defaultValue={c.eleccion_year} required className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Circunscripcion</label>
                  <input name="circunscripcion" defaultValue={c.circunscripcion ?? ""} className={INPUT + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Estado</label>
                  <select name="estado" defaultValue={c.estado ?? ""} className={INPUT + " w-full"}>
                    <option value="inscrito">Inscrito</option>
                    <option value="retirado">Retirado</option>
                    <option value="inhabilitado">Inhabilitado</option>
                    <option value="electo">Electo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Elegido</label>
                  <select name="elegido" defaultValue={c.elegido ? "true" : "false"} className={INPUT + " w-full"}>
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Votos obtenidos</label>
                  <input name="votos_obtenidos" type="number" defaultValue={c.votos_obtenidos ?? 0} className={INPUT + " w-full"} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Guardar cambios
                  </button>
                  <form action={deleteCandidatura.bind(null, c.id)} className="inline">
                    <button type="submit" className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                      Eliminar
                    </button>
                  </form>
                </div>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
