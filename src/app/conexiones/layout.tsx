import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conexiones Politicas",
  description:
    "Grafo interactivo de conexiones entre candidatos, familiares, contratos y partidos politicos de Colombia.",
};

export default function ConexionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
