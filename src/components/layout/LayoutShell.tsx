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
      {/* Disclaimer banner */}
      <div className="mx-auto max-w-[1400px] px-4 pt-2">
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200/60 bg-amber-50/80 px-4 py-2.5">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-[12px] leading-relaxed text-amber-800">
            <strong>Plataforma en desarrollo</strong> — Los datos provienen de fuentes publicas oficiales y estan siendo verificados progresivamente. Algunas cifras pueden estar incompletas o en proceso de actualizacion. Consulta siempre las fuentes originales para decisiones informadas.
          </p>
        </div>
      </div>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
