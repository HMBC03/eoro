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
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-50/95 backdrop-blur-sm border-t border-amber-200/60 px-4 py-2">
        <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-[11px] text-amber-800">
          <strong>Plataforma en desarrollo</strong> — Los datos provienen de fuentes publicas oficiales y estan siendo verificados progresivamente. Consulta siempre las fuentes originales.
        </p>
      </div>
      <Footer />
    </>
  );
}
