import Link from "next/link";
import type { CandidatoCompleto } from "@/lib/types";
import {
  getInitials,
  getEoroScoreColor,
  getEoroScoreBg,
  getEoroScoreLabel,
} from "@/lib/utils";
import { formatCOPShort, calculateAge } from "@/lib/formatters";

interface PresidentialCardProps {
  candidato: CandidatoCompleto;
}

export function PresidentialCard({ candidato }: PresidentialCardProps) {
  const { persona, partido, alertas, antecedentes, score, declaraciones } =
    candidato;

  const alertasAltas = alertas.filter((a) => a.severidad === "alta").length;
  const antecedentesVigentes = antecedentes.filter(
    (a) => a.estado === "vigente"
  ).length;
  const ultimaDeclaracion =
    declaraciones.length > 0
      ? declaraciones[declaraciones.length - 1]
      : null;

  return (
    <Link
      href={`/presidenciales/${persona.id}`}
      className="group block rounded-2xl bg-white p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: partido.color_hex }}
        >
          {getInitials(persona.nombre_completo)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
            {persona.nombre_completo}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: partido.color_hex }}
            >
              {partido.sigla}
            </span>
            <span className="text-[11px] text-gray-400">
              {persona.departamento_origen}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
            {persona.fecha_nacimiento && (
              <span>{calculateAge(persona.fecha_nacimiento)} anos</span>
            )}
            {ultimaDeclaracion && (
              <span>
                {formatCOPShort(ultimaDeclaracion.patrimonio_total)}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-center">
          {(() => {
            const eoroTotal = candidato.eoro_score?.score_total;
            const displayScore =
              eoroTotal != null
                ? eoroTotal
                : score.total > 0
                  ? score.total
                  : null;
            return (
              <>
                {displayScore != null ? (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                    style={{
                      backgroundColor: getEoroScoreBg(displayScore),
                      color: getEoroScoreColor(displayScore),
                    }}
                  >
                    {displayScore}
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold bg-gray-100 text-gray-400">
                    —
                  </div>
                )}
                <p className="mt-1 text-[9px] text-gray-400">
                  {displayScore != null
                    ? getEoroScoreLabel(displayScore)
                    : "Sin datos"}
                </p>
              </>
            );
          })()}
        </div>
      </div>

      {(alertasAltas > 0 || antecedentesVigentes > 0) && (
        <div className="mt-3 flex gap-2 border-t border-gray-50 pt-3">
          {alertasAltas > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fce4e4] px-2 py-0.5 text-[10px] font-medium text-[#c0392b]">
              <span className="h-1 w-1 rounded-full bg-[#e74c3c]" />
              {alertasAltas} alerta{alertasAltas > 1 ? "s" : ""} alta
              {alertasAltas > 1 ? "s" : ""}
            </span>
          )}
          {antecedentesVigentes > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3e2] px-2 py-0.5 text-[10px] font-medium text-[#d35400]">
              <span className="h-1 w-1 rounded-full bg-[#f39c12]" />
              {antecedentesVigentes} antecedente
              {antecedentesVigentes > 1 ? "s" : ""} vigente
              {antecedentesVigentes > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
