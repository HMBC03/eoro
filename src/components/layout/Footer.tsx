import Link from "next/link";
import { APP_NAME, DISCLAIMER, NAV_ITEMS } from "@/lib/constants";

const DATA_SOURCES = [
  "SECOP I/II",
  "Registraduria",
  "SIGEP II",
  "Procuraduria",
  "Contraloria",
  "Cuentas Claras (CNE)",
  "DANE",
  "API Electoral",
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200/30 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900">
                <span className="text-xs font-bold text-[#c4e615]">E</span>
              </div>
              <span className="font-bold text-gray-900">{APP_NAME}</span>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Datos abiertos, ciudadania informada.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Secciones
            </h4>
            <ul className="space-y-2">
              {NAV_ITEMS.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Fuentes de datos
            </h4>
            <div className="flex flex-wrap gap-2">
              {DATA_SOURCES.map((source) => (
                <span
                  key={source}
                  className="rounded-full bg-gray-100/80 px-2.5 py-1 text-[11px] font-medium text-gray-500"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200/30 px-6 py-6">
        <p className="mx-auto max-w-4xl text-center text-[11px] leading-relaxed text-gray-400">
          {DISCLAIMER}
        </p>
      </div>
    </footer>
  );
}
