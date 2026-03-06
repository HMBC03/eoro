"use client";

import { useEffect } from "react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { NavItem } from "./LayoutShell";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  navItems: readonly NavItem[];
}

export function MobileMenu({ isOpen, onClose, pathname, navItems }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <nav className="absolute inset-y-0 right-0 w-72 bg-white shadow-2xl rounded-l-3xl">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900">
              <span className="text-xs font-bold text-[#c4e615]">E</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
            aria-label="Cerrar menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all mb-1",
                  isActive
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#c4e615]" />}
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
          <p className="text-[11px] text-gray-400">
            Datos abiertos, ciudadania informada.
          </p>
        </div>
      </nav>
    </div>
  );
}
