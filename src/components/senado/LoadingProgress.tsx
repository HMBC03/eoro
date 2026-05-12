interface LoadingProgressProps {
  step: string;
  progress: number;
}

export function LoadingProgress({ step, progress }: LoadingProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-[#c4e615] animate-ping" />
          <span className="text-sm font-medium text-gray-600">Cargando datos del Senado...</span>
        </div>
        <p className="text-xs text-gray-400 mb-6">{step}</p>
      </div>

      <div className="w-64">
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden border border-gray-200">
          <div
            className="h-full rounded-full bg-[#c4e615] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-gray-400 font-mono">{progress}%</p>
      </div>
    </div>
  );
}
