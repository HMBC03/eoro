import Link from "next/link";
import Image from "next/image";
import { ELECCIONES_CONGRESO_2026 } from "@/lib/constants";
import { daysUntil } from "@/lib/formatters";

const STATS = [
  { value: "2,844", label: "Candidatos inscritos", icon: "users" },
  { value: "33", label: "Departamentos", icon: "map" },
  { value: "6M+", label: "Contratos SECOP", icon: "file" },
  { value: "10+", label: "Fuentes oficiales", icon: "database" },
];

const SECTIONS = [
  {
    title: "Candidatos 2026",
    desc: "Perfiles completos con historial, patrimonio, antecedentes y financiacion de campana.",
    href: "/candidatos",
    tag: "Prioridad",
    tagColor: "bg-[#c4e615] text-gray-900",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Mapa Interactivo",
    desc: "Explora Colombia por departamento. Contratos, candidatos y alertas por region.",
    href: "/mapa",
    tag: "Fase 3",
    tagColor: "bg-gray-100 text-gray-500",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    title: "Conexiones Politicas",
    desc: "Grafos visuales de redes: familiares, contratos, partidos y financiadores.",
    href: "/conexiones",
    tag: "Fase 4",
    tagColor: "bg-gray-100 text-gray-500",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: "Contratos Nacionales",
    desc: "Dashboard de contratacion publica con datos SECOP por entidad y departamento.",
    href: "/contratos",
    tag: "Fase 4",
    tagColor: "bg-gray-100 text-gray-500",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Historial Funcionarios",
    desc: "Traza historica de cualquier funcionario publico: cargos, declaraciones y contratos.",
    href: "/historial",
    tag: "Fase 5",
    tagColor: "bg-gray-100 text-gray-500",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Busca", desc: "Encuentra cualquier candidato o funcionario por nombre, departamento o partido." },
  { step: "2", title: "Explora", desc: "Revisa su historial politico, patrimonio, antecedentes, familiares y contratos." },
  { step: "3", title: "Decide", desc: "Toma decisiones informadas con datos verificables de fuentes oficiales." },
];

export default function Home() {
  const diasParaElecciones = daysUntil(ELECCIONES_CONGRESO_2026);

  return (
    <div className="min-h-screen">
      {/* Hero with background image — extends behind nav */}
      <section className="relative overflow-hidden -mt-[72px]">
        {/* Colombia background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1920&q=80&auto=format&fit=crop"
            alt="Colombia paisaje"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-[#f5f5f0]" />
        </div>

        <div className="relative z-10 px-6 pt-28 pb-28 md:pt-36 md:pb-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="max-w-3xl">
              {diasParaElecciones > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#c4e615] px-4 py-1.5 text-sm font-semibold text-gray-900 mb-6">
                  <span className="h-2 w-2 rounded-full bg-gray-900 animate-pulse" />
                  {diasParaElecciones} dias para elecciones
                </span>
              )}
              <h1 className="text-4xl font-light text-white leading-tight md:text-6xl lg:text-7xl">
                Conoce a quienes
                <br />
                <span className="font-bold">te gobiernan</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/70 leading-relaxed">
                Consulta la trayectoria politica, patrimonial y contractual de
                candidatos y funcionarios publicos de Colombia.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/candidatos"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c4e615] px-7 py-3.5 text-sm font-semibold text-gray-900 transition-all hover:bg-[#d4f025] hover:shadow-lg hover:shadow-[#c4e615]/20"
                >
                  Ver Candidatos 2026
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/mapa"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  Explorar Mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="px-6 -mt-12 relative z-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-400">{stat.label}</p>
                <div className="mt-3 h-1 w-10 rounded-full bg-[#c4e615]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-gray-900">
                Explora los <span className="font-bold">datos</span>
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Cinco herramientas para fiscalizar a quienes manejan lo publico.
              </p>
            </div>
            <Link href="/candidatos" className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Ver todo
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-2xl bg-white p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-[#c4e615]">
                    {section.icon}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${section.tagColor}`}>
                    {section.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {section.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
                  {section.desc}
                </p>
                <div className="mt-4 flex items-center text-xs font-medium text-gray-400 group-hover:text-[#9bbf0a] transition-colors">
                  Explorar
                  <svg className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-2xl bg-gray-900 p-8 md:p-12">
            <h2 className="text-2xl font-light text-white mb-10 text-center">
              Como <span className="font-bold">funciona</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c4e615] text-lg font-bold text-gray-900">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Colombia image banner */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=1920&q=80"
              alt="Cartagena, Colombia"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent flex items-center px-8 md:px-12">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Datos abiertos,<br />ciudadania informada</h3>
                <p className="mt-2 text-sm text-white/60">Plataforma de fiscalizacion ciudadana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1400px] text-center">
          <h3 className="mb-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Fuentes de datos oficiales
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "SECOP I/II",
              "Registraduria Nacional",
              "SIGEP II",
              "Procuraduria General",
              "Contraloria General",
              "Cuentas Claras (CNE)",
              "DANE / DIVIPOLA",
              "API Electoral",
            ].map((source) => (
              <span
                key={source}
                className="rounded-full bg-white border border-gray-200/60 px-3.5 py-1.5 text-xs font-medium text-gray-500"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
