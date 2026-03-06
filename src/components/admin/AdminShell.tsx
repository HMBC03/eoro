"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Personas", href: "/admin/personas", icon: "users" },
  { label: "Contratos", href: "/admin/contratos", icon: "doc" },
  { label: "Alertas", href: "/admin/alertas", icon: "bell" },
];

interface AdminShellProps {
  children: React.ReactNode;
  adminName: string;
  adminRole: string;
}

export function AdminShell({ children, adminName, adminRole }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                <span className="text-xs font-bold text-[#c4e615]">E</span>
              </div>
              <span className="text-sm font-bold text-gray-900">Admin</span>
            </Link>

            <nav className="ml-6 hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Ver sitio
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div className="text-right">
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

      {/* Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </main>
    </div>
  );
}
