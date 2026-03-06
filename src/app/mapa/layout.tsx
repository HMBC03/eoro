import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mapa Interactivo",
  description:
    "Mapa interactivo de Colombia por departamentos con datos de candidatos, contratos y alertas.",
};

export default function MapaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
