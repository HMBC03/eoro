"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [showLoader, setShowLoader] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setShowLoader(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" fill="#FCD116" />
            <path d="M12 2C12 2 6 6 6 12C6 18 12 22 12 22C12 22 18 18 18 12C18 6 12 2 12 2Z" fill="#003893" />
            <path d="M12 22C12 22 16 18 16 12C16 7 12 4 12 4C12 4 8 7 8 12C8 16 12 22 12 22Z" fill="#CE1126" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-800">Consultando datos oficiales</h2>
        <p className="text-xs text-gray-500 mt-1">Cargando información del Senado...</p>
      </div>
    </div>
  );
}