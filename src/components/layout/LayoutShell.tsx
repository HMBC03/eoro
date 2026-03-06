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
      <Footer />
    </>
  );
}
