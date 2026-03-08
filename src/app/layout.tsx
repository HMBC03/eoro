import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { getModuleConfig } from "@/lib/data/modulos";
import { NAV_ITEMS } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eoro",
    template: "%s | Eoro",
  },
  description:
    "Plataforma de fiscalizacion ciudadana. Datos abiertos de candidatos y funcionarios publicos de Colombia.",
  keywords: [
    "transparencia",
    "colombia",
    "candidatos",
    "elecciones 2026",
    "funcionarios publicos",
    "contratos",
    "SECOP",
    "fiscalizacion",
  ],
  openGraph: {
    title: "Eoro",
    description:
      "Conoce a quienes te gobiernan. Datos abiertos de candidatos y funcionarios publicos.",
    locale: "es_CO",
    type: "website",
  },
};

const MODULE_HREF_MAP: Record<string, string> = {
  candidatos: "/candidatos",
  gobierno: "/gobierno",
  mapa: "/mapa",
  contratos: "/contratos",
  conexiones: "/conexiones",
  presupuesto: "/presupuesto",
  historial: "/historial",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const moduleConfig = await getModuleConfig();
  const hiddenHrefs = new Set(
    moduleConfig
      .filter((m) => !m.visible && MODULE_HREF_MAP[m.module_key])
      .map((m) => MODULE_HREF_MAP[m.module_key])
  );

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !hiddenHrefs.has(item.href)
  );

  return (
    <html lang="es-CO">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutShell navItems={visibleNavItems}>{children}</LayoutShell>
      </body>
    </html>
  );
}
