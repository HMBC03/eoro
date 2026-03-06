import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contratos Nacionales",
  description:
    "Dashboard de contratos publicos de Colombia con datos SECOP. Filtra, busca y valida informacion contractual.",
};

export default function ContratosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
