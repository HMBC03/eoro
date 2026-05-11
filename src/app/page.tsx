import Link from "next/link";
import Image from "next/image";
import { ELECCIONES_PRESIDENCIA_2026 } from "@/lib/constants";
import { daysUntil } from "@/lib/formatters";

const STATS = [
  { value: "26", label: "Entidades del Estado", icon: "building" },
  { value: "4", label: "Candidatos Presidenciales", icon: "users" },
  { value: "$523B", label: "Presupuesto PGN 2025", icon: "money" },
  { value: "10+", label: "Fuentes Oficiales", icon: "database" },
];

const SECTIONS = [
  {
    title: "Recaudo e Ingresos",
    desc: "DIAN, MinHacienda, DGPM, SGR Regalías, Banrep. Lo que el Estado recauda y administra.",
    href: "/gobierno",
    tag: "Nueva Sección",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2 2-1.343 2-3 2-2 .895-3 3-2zm0 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2 2-1.343 2-3 2-2 .895-3 3-2zm0 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2 2-1.343 2-3 2-2 .895-3 3-2z" />
      </svg>
    ),
  },
  {
    title: "Presupuesto y Ejecución",
    desc: "PGN, SIIF, CHIP, DNP. Seguimiento al presupuesto y su ejecución.",
    href: "/gobierno",
    tag: "Nueva Sección",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Contratación Pública",
    desc: "SECOP I/II, CCE, SIRI, RUP. Lo que el Estado compra y a quién se lo compra.",
    href: "/gobierno",
    tag: "Nueva Sección",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Órganos de Control",
    desc: "CGR, CGN, PGN, FGN. Entidades de vigilancia y control.",
    href: "/gobierno",
    tag: "Nueva Sección",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.018-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 2.042A11.955 11.955 0 012 22c5.058 0 9.146-2.04 12.014-5.018z" />
      </svg>
    ),
  },
  {
    title: "Gestión de Activos",
    desc: "SAE, Prosperidad Social, Colpensiones, TES. Bienes, pensiones y subsidios del Estado.",
    href: "/gobierno",
    tag: "Nueva Sección",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    title: "Datos Abiertos",
    desc: "datos.gov.co, SUIT, PEFA. Transparencia y evaluaciones externas.",
    href: "/gobierno",
    tag: "Nueva Sección",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9m0 0H3m0 0c1.657 0 3 4.03 3 9m-3-9a9 9 0 019-9" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Monitorea", desc: "Observa lo que las entidades públicas reportan sobre recursos, presupuestos y contratos." },
  { step: "2", title: "Compara", desc: "Cruza datos de múltiples fuentes oficiales: SECOP, SIIF, DIAN, SIGEP." },
  { step: "3", title: "Fiscaliza", desc: "Identifica alertas, inconsistencias y concentra recursos en quienes los manejan." },
];

export default function Home() {
  const diasParaElecciones = daysUntil(ELECCIONES_PRESIDENCIA_2026);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden -mt-[96px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://4kwallpapers.com/images/walls/thumbs_3t/3214.jpg"
            alt="Colombia"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-[#f5f5f0]" />
        </div>

        <div className="relative z-10 px-6 pt-28 pb-28 md:pt-36 md:pb-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="max-w-3xl">
<span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-4 py-1.5 text-sm font-semibold text-white mb-6">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                {diasParaElecciones > 0 ? `Faltan ${diasParaElecciones} días para las elecciones` : "Elecciones en curso"}
              </span>
              <h1 className="text-4xl font-light text-white leading-tight md:text-6xl lg:text-7xl">
                Centro de monitoreo de
                <br />
                <span className="font-bold">recursos públicos.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/70 leading-relaxed">
                Seguimiento en tiempo real a cómo se administran los recursos del Estado. 
                Conforme lo reportan las entidades: presupuesto, contratos, recaudo y ejecución.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/gobierno"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c4e615] px-7 py-3.5 text-sm font-semibold text-gray-900 transition-all hover:bg-[#d4f025] hover:shadow-lg hover:shadow-[#c4e615]/20"
                >
                  Explorar Entidades
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/presidenciales"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  Ver Presidenciales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-900">
              Recursos públicos por <span className="font-bold">entidad</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500 italic">
              "Seguimos el desempeño de funcionarios electos — el núcleo de la veeduría ciudadana"
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Monitoreamos 6 categorías de recursos conforme las entidades los reportan.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-none bg-white p-5 border border-black transition-all shadow-[5px_5px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5"
              >
                <h3 className="font-bold text-black text-lg group-hover:text-gray-600 transition-colors">
                  {section.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
                  {section.desc}
                </p>
                <div className="mt-4 flex items-center text-xs font-medium text-black transition-colors">
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
          <div className="rounded-none bg-white border border-black p-8 md:p-12 shadow-[5px_5px_0px_0px_#000]">
            <h2 className="text-2xl font-light text-black mb-10 text-center">
              Cómo <span className="font-bold">funciona</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-black text-lg font-bold text-black shadow-[4px_4px_0px_0px_#000]">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-black">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=1920&q=80"
              alt="Cartagena, Colombia"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex items-center px-8 md:px-12">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Recursos públicos conforme<br />lo reportado por entidades
                </h3>
                <p className="mt-2 text-sm text-white/60">Plataforma de monitoreo ciudadano</p>
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
              "SIIF Nación",
              "DIAN",
              "SIGEP II",
              "Procuraduria",
              "Contraloria",
              "Cuentas Claras",
              "DNP",
              "MinHacienda",
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
