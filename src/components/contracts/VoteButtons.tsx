"use client";

interface VoteButtonsProps {
  contratoId: string;
  validaCount: number;
  cuestionaCount: number;
  userVote: "valida" | "cuestiona" | null;
  onVote: (contratoId: string, type: "valida" | "cuestiona") => void;
  compact?: boolean;
}

export function VoteButtons({
  contratoId,
  validaCount,
  cuestionaCount,
  userVote,
  onVote,
  compact = false,
}: VoteButtonsProps) {
  const isValida = userVote === "valida";
  const isCuestiona = userVote === "cuestiona";

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); onVote(contratoId, "valida"); }}
          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-all ${
            isValida
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
          }`}
          title="Valida esta informacion"
        >
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {validaCount}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onVote(contratoId, "cuestiona"); }}
          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-all ${
            isCuestiona
              ? "bg-red-100 text-red-600"
              : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500"
          }`}
          title="Cuestiona esta informacion"
        >
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.533-1.467l-1.286 1.286a4 4 0 01-5.657-5.657l1.286-1.286m4.243-4.243l1.286-1.286a4 4 0 015.657 5.657l-1.286 1.286" />
          </svg>
          {cuestionaCount}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onVote(contratoId, "valida")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
          isValida
            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Valida
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          isValida ? "bg-emerald-200/60 text-emerald-800" : "bg-gray-200/60 text-gray-500"
        }`}>
          {validaCount}
        </span>
      </button>

      <button
        onClick={() => onVote(contratoId, "cuestiona")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
          isCuestiona
            ? "bg-red-100 text-red-600 ring-1 ring-red-200"
            : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        Cuestiona
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          isCuestiona ? "bg-red-200/60 text-red-800" : "bg-gray-200/60 text-gray-500"
        }`}>
          {cuestionaCount}
        </span>
      </button>
    </div>
  );
}
