import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contribuye",
  description:
    "Unete al equipo de voluntarios de Eoro y aporta a la democracia colombiana.",
};

const ROLES = [
  {
    title: "Desarrolladores",
    desc: "Frontend (Next.js/React), backend (Supabase/PostgreSQL), scraping de datos publicos, APIs.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Periodistas / Investigadores",
    desc: "Verificacion de datos, cruce de fuentes oficiales, investigacion de contratacion publica.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5" />
      </svg>
    ),
  },
  {
    title: "Disenadores UX/UI",
    desc: "Visualizacion de datos, experiencia de usuario, accesibilidad y diseno responsive.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "Abogados / Politologos",
    desc: "Analisis normativo, interpretacion de datos electorales, asesoria legal sobre datos abiertos.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
  {
    title: "Ciudadanos activos",
    desc: "Reportar inconsistencias, sugerir mejoras, difundir la plataforma en redes sociales.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const PRINCIPLES = [
  "100% voluntario — sin animo de lucro",
  "Datos publicos y verificables — Ley 1712 de 2014",
  "Codigo abierto — transparencia total",
  "Apartidista — fiscalizamos a todos por igual",
  "Anonimato protegido — tu identidad es segura",
];

export default function ContribuyePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-12 pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#c4e615] px-4 py-1.5 text-sm font-semibold text-gray-900 mb-6">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Voluntarios activos
            </span>
            <h1 className="text-4xl font-light text-gray-900 leading-tight md:text-5xl lg:text-6xl">
              Este proyecto necesita
              <br />
              <span className="font-bold">gente como tu</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
              Eoro es una plataforma ciudadana construida por voluntarios que creen
              en la democracia informada. No somos un partido, no somos una ONG.
              Somos ciudadanos que quieren saber quienes nos gobiernan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:hectormbeltran@proton.me?subject=Quiero%20contribuir%20a%20Eoro"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-[#c4e615] transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                Escribenos
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
              <span className="text-sm text-gray-400">
                hectormbeltran@proton.me
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Roles needed */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Que <span className="font-bold">necesitamos</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Cualquier aporte suma. No importa tu nivel de experiencia.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-[#c4e615] mb-4">
                  {role.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{role.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-2xl bg-gray-900 p-8 md:p-12">
            <h2 className="text-2xl font-light text-white mb-8 text-center">
              Nuestros <span className="font-bold">principios</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c4e615] text-xs font-bold text-gray-900">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1400px] text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            La democracia se <span className="font-bold">defiende con datos</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8 max-w-lg mx-auto">
            Un correo es suficiente. Cuentanos quien eres, que sabes hacer
            y cuanto tiempo puedes dedicar. Nosotros nos encargamos del resto.
          </p>
          <a
            href="mailto:hectormbeltran@proton.me?subject=Quiero%20contribuir%20a%20Eoro"
            className="inline-flex items-center gap-2 rounded-full bg-[#c4e615] px-8 py-4 text-sm font-semibold text-gray-900 transition-all hover:bg-[#d4f025] hover:shadow-lg hover:shadow-[#c4e615]/20"
          >
            Quiero contribuir
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
