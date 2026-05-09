"use client";

interface GlobalLoadingProps {
  visible: boolean;
}

export function GlobalLoading({ visible }: GlobalLoadingProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full animate-[spin_2s_linear_infinite]"
            style={{ animationDirection: "reverse" }}
            fill="none"
          >
            <circle cx="12" cy="12" r="10" fill="#FCD116" />
            <path d="M12 2C12 2 6 6 6 12C6 18 12 22 12 22C12 22 18 18 18 12C18 6 12 2 12 2Z" fill="#003893" />
            <path d="M12 22C12 22 16 18 16 12C16 7 12 4 12 4C12 4 8 7 8 12C8 16 12 22 12 22Z" fill="#CE1126" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Consultando datos oficiales</h2>
        <p className="text-sm text-gray-500">Obteniendo información actualizada...</p>
      </div>
    </div>
  );
}