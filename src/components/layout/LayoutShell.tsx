"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

interface LayoutShellProps {
  children: React.ReactNode;
  navItems: readonly NavItem[];
}

export function LayoutShell({ children, navItems }: LayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header navItems={navItems} />
      <main className="min-h-screen">{children}</main>
      {/* Disclaimer banner — fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-400/95 backdrop-blur-sm border-t-2 border-amber-500 px-4 py-3">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <svg className="h-5 w-5 shrink-0 text-amber-900" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs sm:text-sm font-medium text-amber-950">
            <strong>En construcción — No fiarse de la información.</strong> Esta plataforma está en etapa activa de desarrollo. Los datos mostrados pueden ser de prueba, estar incompletos o contener errores. Estamos trabajando para verificar cada fuente.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
