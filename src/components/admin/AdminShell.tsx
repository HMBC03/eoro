"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: "General",
    items: [
      { label: "Dashboard", href: "/admin" },
      { label: "Modulos", href: "/admin/modulos" },
    ],
  },
  {
    label: "Personas",
    items: [
      { label: "Personas", href: "/admin/personas" },
      { label: "Candidaturas", href: "/admin/candidaturas" },
      { label: "Cargos publicos", href: "/admin/cargos" },
      { label: "Partidos", href: "/admin/partidos" },
    ],
  },
  {
    label: "Datos",
    items: [
      { label: "Contratos", href: "/admin/contratos" },
      { label: "Alertas", href: "/admin/alertas" },
      { label: "Declaraciones", href: "/admin/declaraciones" },
      { label: "Antecedentes", href: "/admin/antecedentes" },
      { label: "Vinculos", href: "/admin/vinculos" },
      { label: "Financiacion", href: "/admin/financiacion" },
    ],
  },
  {
    label: "Presupuesto",
    items: [
      { label: "Ramas gobierno", href: "/admin/ramas" },
      { label: "Entidades", href: "/admin/entidades" },
      { label: "Scores", href: "/admin/scores" },
    ],
  },
  {
    label: "Grafos",
    items: [
      { label: "Grafo nodos", href: "/admin/grafo-nodos" },
      { label: "Grafo edges", href: "/admin/grafo-edges" },
      { label: "Dynasty nodos", href: "/admin/dynasty-nodos" },
      { label: "Dynasty edges", href: "/admin/dynasty-edges" },
      { label: "Family NITs", href: "/admin/family-nits" },
    ],
  },
];

interface AdminShellProps {
  children: React.ReactNode;
  adminName: string;
  adminRole: string;
}

export function AdminShell({ children, adminName, adminRole }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900">
                <span className="text-[10px] font-bold text-[#c4e615]">E</span>
              </div>
              <span className="text-sm font-bold text-gray-900">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Ver sitio
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-700">{adminName}</p>
              <p className="text-[10px] text-gray-400">{adminRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-[49px] z-30 h-[calc(100vh-49px)] w-56 overflow-y-auto border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-3 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-6 py-8 min-w-0">
          <div className="mx-auto max-w-[1100px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
