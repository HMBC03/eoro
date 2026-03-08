import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { EORO_SCORE_TIERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Metodología",
  description:
    "Cómo funciona el Éoro Score: sistema de puntuación de riesgo de corrupción basado en datos públicos verificables.",
};

export default async function MetodologiaPage() {
  const supabase = await createClient();

  const [{ data: categorias }, { data: variables }] = await Promise.all([
    supabase
      .schema("eoro")
      .from("eoro_categorias")
      .select("*")
      .order("orden"),
    supabase
      .schema("eoro")
      .from("eoro_variables")
      .select("*, eoro_categorias(nombre, slug)")
      .order("orden"),
  ]);

  const cats = (categorias ?? []) as Array<{
    id: string;
    nombre: string;
    slug: string;
    peso_max: number;
    descripcion: string;
    orden: number;
  }>;

  const vars = (variables ?? []) as Array<{
    id: string;
    categoria_id: string;
    nombre: string;
    slug: string;
    penalizacion: number;
    condicion: string;
    fuente_tipo: string;
    activa: boolean;
    eoro_categorias: { nombre: string; slug: string };
  }>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-12 pb-16">
        <div className="mx-auto max-w-[900px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#c4e615] px-4 py-1.5 text-sm font-semibold text-gray-900 mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Metodología pública
          </span>
          <h1 className="text-4xl font-light text-gray-900 leading-tight md:text-5xl">
            Cómo funciona el{" "}
            <span className="font-bold">Éoro Score</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
            El Éoro es un termómetro de riesgo de corrupción. Cada persona empieza en 100 puntos.
            Cada hallazgo verificado resta puntos. No hacemos juicios — documentamos hechos.
          </p>
        </div>
      </section>

      {/* Principios */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-2xl bg-gray-900 p-8">
            <h2 className="text-xl font-light text-white mb-6">
              Lo que el Éoro <span className="font-bold">NO es</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: "No es un juicio", desc: "No decimos culpable. Documentamos investigaciones, sanciones y hechos verificables con sus fuentes." },
                { title: "No es una campaña", desc: "No promovemos ni atacamos a nadie. Los números hablan solos." },
                { title: "No es fijo", desc: "Si una investigación se resuelve con inocencia plena, el score se restaura parcialmente." },
                { title: "No perdona por defecto", desc: "Un archivo por vencimiento de términos NO restaura puntos. Se documenta por qué se cerró." },
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c4e615] text-xs font-bold text-gray-900">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Escala */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Escala del <span className="font-bold">termómetro</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            5 niveles de riesgo basados en hallazgos acumulados
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {EORO_SCORE_TIERS.map((tier) => (
              <div
                key={tier.slug}
                className="rounded-2xl p-5 border"
                style={{
                  backgroundColor: tier.bg,
                  borderColor: `${tier.color}20`,
                }}
              >
                <p
                  className="text-2xl font-bold"
                  style={{ color: tier.color }}
                >
                  {tier.min}-{tier.max}
                </p>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: tier.color }}
                >
                  {tier.label}
                </p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías y Variables */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Categorías y <span className="font-bold">variables</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Cada categoría tiene un peso máximo de penalización. Las variables dentro de cada
            categoría restan puntos cuando se verifican hallazgos.
          </p>

          <div className="space-y-4">
            {cats.map((cat) => {
              const catVars = vars.filter(
                (v) => v.categoria_id === cat.id && v.activa
              );
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cat.nombre}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {cat.descripcion}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-xl bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600">
                      Máx -{cat.peso_max}
                    </span>
                  </div>
                  {catVars.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {catVars.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between px-6 py-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-gray-900">
                              {v.nombre}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                              {v.condicion}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                              {v.fuente_tipo}
                            </span>
                            <span className="text-sm font-bold text-red-500">
                              -{v.penalizacion}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400">
                        Impacto proviene de reportes ciudadanos verificados
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Restauración */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Reglas de <span className="font-bold">restauración</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            El Éoro puede restaurarse parcialmente. Pero las marcas quedan. Siempre se documenta qué pasó.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { evento: "Inocencia plena dictaminada", efecto: "Restaura 80% de puntos", condicion: "Sentencia explícita de inocencia por fondo del asunto" },
              { evento: "Archivo por vencimiento", efecto: "NO restaura", condicion: "Se documenta: archivado por vencimiento, no por inocencia" },
              { evento: "Archivo por error procesal", efecto: "Restaura 60%", condicion: "Se documenta el error y si hubo cambio de fiscal/juez" },
              { evento: "Proceso anulado", efecto: "Restaura 100%", condicion: "Proceso declarado nulo por vicios procesales" },
              { evento: "Prescripción", efecto: "Restaura 50%", condicion: "Se documenta que prescribió por tiempo, no por inocencia" },
              { evento: "Reporte ciudadano desmentido", efecto: "Restaura 100% del reporte", condicion: "Evidencia contundente que desmiente el reporte original" },
            ].map((r, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {r.evento}
                </p>
                <p className="text-xs font-medium text-emerald-600 mt-1">
                  {r.efecto}
                </p>
                <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                  {r.condicion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reporte Ciudadano */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-2xl bg-gray-900 p-8">
            <h2 className="text-xl font-light text-white mb-4">
              Reporte <span className="font-bold">ciudadano</span>
            </h2>
            <p className="text-sm text-gray-400 mb-6 max-w-lg leading-relaxed">
              Inspirado en g0v Taiwán: la ciudadanía puede reportar actos que no aparecen en fuentes
              oficiales pero son verificables. Solo reportes verificados con 2+ fuentes independientes
              afectan el score.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Reporte", "Verificación", "Clasificación", "Impacto"].map(
                (paso, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c4e615] text-xs font-bold text-gray-900">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">{paso}:</span>{" "}
                      {i === 0 && "Ciudadano envía descripción + evidencia"}
                      {i === 1 && "Equipo verifica con mínimo 2 fuentes independientes"}
                      {i === 2 && "Verificado, parcialmente verificado, o no verificado"}
                      {i === 3 && "Solo reportes verificados restan puntos (máx -15)"}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Transparencia */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Transparencia sobre la{" "}
            <span className="font-bold">transparencia</span>
          </h2>
          <p className="text-sm text-gray-400 mb-2 max-w-lg mx-auto">
            Nosotros también estamos sujetos a escrutinio. Nuestro código es abierto,
            nuestra metodología es pública, nuestros datos tienen fuente.
          </p>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Si encontrás un error, reportalo.
          </p>
        </div>
      </section>
    </div>
  );
}
