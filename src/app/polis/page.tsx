import type { Metadata } from "next";
import PolisEmbed from "./PolisEmbed";

export const metadata: Metadata = {
  title: "Polis — Opinión ciudadana",
  description:
    "Participá en conversaciones ciudadanas sobre transparencia y democracia en Colombia. Tu opinión importa.",
};

const COMO_FUNCIONA = [
  {
    paso: "Leé las opiniones",
    desc: "Vas a ver frases cortas escritas por otros ciudadanos sobre temas de transparencia y democracia.",
  },
  {
    paso: "Votá",
    desc: "Hacé clic en De acuerdo, En desacuerdo o Paso. No hay respuestas correctas — es tu opinión.",
  },
  {
    paso: "Escribí la tuya",
    desc: "Podés escribir tu propia opinión (máximo 140 caracteres). Otros la votarán.",
  },
  {
    paso: "Mirá los resultados",
    desc: "Un algoritmo agrupa las opiniones y muestra dónde hay consenso y dónde hay diferencias.",
  },
];

const PREGUNTAS = [
  {
    q: "¿Tengo que registrarme?",
    a: "No. Podés participar sin cuenta y sin dar tu nombre. Es completamente anónimo.",
  },
  {
    q: "¿Quién ve mis respuestas?",
    a: "Nadie individualmente. Polis solo muestra patrones grupales — nunca identifica a una persona.",
  },
  {
    q: "¿Para qué sirve esto?",
    a: "Para entender qué piensa la ciudadanía sobre la transparencia política. Los resultados nos ayudan a priorizar funciones de la plataforma.",
  },
  {
    q: "¿Quién hizo Polis?",
    a: "Es una plataforma de código abierto creada por The Computational Democracy Project. Fue usada por el gobierno de Taiwán para legislar. Nosotros no almacenamos los datos — viven en los servidores de Polis.",
  },
];

export default function PolisPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-12 pb-16">
        <div className="mx-auto max-w-[900px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#c4e615] px-4 py-1.5 text-sm font-semibold text-gray-900 mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            Democracia participativa
          </span>
          <h1 className="text-4xl font-light text-gray-900 leading-tight md:text-5xl">
            Tu opinión{" "}
            <span className="font-bold">construye democracia</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
            Polis es una herramienta de participación ciudadana que permite a miles de personas
            opinar, encontrar consensos y descubrir en qué piensan diferente. Todo sin registrarse
            y de forma anónima.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Cómo <span className="font-bold">funciona</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            4 pasos simples. No necesitás cuenta ni dar tu nombre.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {COMO_FUNCIONA.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c4e615] text-sm font-bold text-gray-900">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.paso}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embed de Polis */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-2xl bg-gray-900 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c4e615]">
                <svg className="h-5 w-5 text-gray-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Conversación activa
                </h2>
                <p className="text-xs text-gray-400">
                  Transparencia y democracia en Colombia
                </p>
              </div>
            </div>

            <PolisEmbed pageId="transparencia-general" />

            <p className="text-[10px] text-gray-500 mt-4 text-center">
              Powered by Polis — plataforma de código abierto para democracia participativa.
              Los datos se almacenan en los servidores de Polis, no en Éoro.
            </p>
          </div>
        </div>
      </section>

      {/* Qué logra Polis */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-2xl bg-gray-900 p-8">
            <h2 className="text-xl font-light text-white mb-6">
              Qué hace Polis que las redes <span className="font-bold">no hacen</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: "No polariza", desc: "Las redes premian la indignación. Polis eleva las ideas en las que múltiples grupos coinciden." },
                { title: "Preserva minorías", desc: "Si un grupo pequeño piensa diferente, eso se muestra. No se borra ni se oculta por votos negativos." },
                { title: "Escala a miles", desc: "Funciona con 10 o con 100.000 personas. El algoritmo agrupa automáticamente sin que nadie lo configure." },
                { title: "Anonimato real", desc: "No hay cuentas, no hay nombres, no hay perfiles. Solo opiniones y patrones." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c4e615] text-xs font-bold text-gray-900">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            Preguntas <span className="font-bold">frecuentes</span>
          </h2>
          <div className="space-y-3">
            {PREGUNTAS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-900">{faq.q}</p>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiración */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Inspirado en <span className="font-bold">g0v Taiwán</span>
          </h2>
          <p className="text-sm text-gray-400 mb-2 max-w-lg mx-auto">
            El gobierno de Taiwán usó Polis para legislar la regulación de Uber, la
            economía colaborativa y la venta de alcohol online. Miles de ciudadanos
            participaron y se encontraron consensos que los políticos no habían previsto.
          </p>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Éoro trae ese modelo a Colombia. Tu voz cuenta.
          </p>
        </div>
      </section>
    </div>
  );
}
