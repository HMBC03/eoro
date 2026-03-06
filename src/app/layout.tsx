import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
