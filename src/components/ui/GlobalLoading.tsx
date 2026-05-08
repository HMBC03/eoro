"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function GlobalLoading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleStart = () => setVisible(true);
    const handleComplete = () => setVisible(false);

    window.addEventListener("beforeunload", handleStart);
    
    const timeout = setTimeout(() => setVisible(false), 500);
    
    return () => {
      window.removeEventListener("beforeunload", handleStart);
      clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/1200px-Flag_of_Colombia.svg.png"
            alt="Democracia"
            width={128}
            height={128}
            className="object-contain animate-pulse"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Consultando datos oficiales</h2>
        <p className="text-sm text-gray-500">Obteniendo información del Senado de la República...</p>
      </div>
    </div>
  );
}