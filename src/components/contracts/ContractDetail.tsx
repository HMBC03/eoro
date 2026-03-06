"use client";

import type { ContratoConVotos } from "@/lib/types";
import type { ContratoScore } from "@/lib/contract-score";
import { Modal } from "@/components/ui/Modal";
import { VoteButtons } from "./VoteButtons";
import { ContractScoreBadge } from "./ContractScoreBadge";
import { formatCOP, formatDateCO } from "@/lib/formatters";

interface ContractDetailProps {
  contrato: ContratoConVotos | null;
  score: ContratoScore | null;
  isOpen: boolean;
  onClose: () => void;
  userVote: "valida" | "cuestiona" | null;
  counts: { valida: number; cuestiona: number };
  onVote: (id: string, type: "valida" | "cuestiona") => void;
}

const ESTADO_STYLES: Record<string, string> = {
  activo: "bg-emerald-50 text-emerald-700",
  finalizado: "bg-blue-50 text-blue-700",
  liquidado: "bg-gray-100 text-gray-500",
  terminado_anticipadamente: "bg-red-50 text-red-600",
};

const ESTADO_LABELS: Record<string, string> = {
  activo: "Activo",
  finalizado: "Finalizado",
  liquidado: "Liquidado",
  terminado_anticipadamente: "Terminado anticipadamente",
};

export function ContractDetail({
  contrato,
  score,
  isOpen,
  onClose,
  userVote,
  counts,
  onVote,
}: ContractDetailProps) {
  if (!contrato) return null;

  const duracionDias = Math.round(
    (new Date(contrato.fecha_fin).getTime() - new Date(contrato.fecha_inicio).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={contrato.contratista_nombre} size="lg">
      {/* SECOP ID + Estado */}
      <div className="flex items-center gap-2 mb-5">
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-mono text-gray-500">
          {contrato.secop_id}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${ESTADO_STYLES[contrato.estado]}`}>
          {ESTADO_LABELS[contrato.estado]}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Valor contrato" value={formatCOP(contrato.valor_contrato)} bg="bg-emerald-50" text="text-emerald-700" />
        <StatCard label="Adiciones" value={formatCOP(contrato.valor_adiciones)} bg="bg-sky-50" text="text-sky-700" />
        <StatCard label="Valor total" value={formatCOP(contrato.valor_contrato + contrato.valor_adiciones)} bg="bg-amber-50" text="text-amber-700" />
        <StatCard label="Duracion" value={`${duracionDias} dias`} bg="bg-purple-50" text="text-purple-700" />
      </div>

      {/* Risk score */}
      {score && (
        <div className="mb-5">
          <ContractScoreBadge score={score} size="md" />
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5 text-xs">
        <Detail label="Entidad" value={contrato.entidad_nombre} />
        <Detail label="NIT Entidad" value={contrato.entidad_nit} />
        <Detail label="Contratista" value={contrato.contratista_nombre} />
        <Detail label="NIT Contratista" value={contrato.contratista_nit} />
        <Detail label="Departamento" value={contrato.departamento} />
        <Detail label="Municipio" value={contrato.municipio} />
        <Detail label="Modalidad" value={contrato.modalidad} />
        <Detail label="Fecha firma" value={formatDateCO(contrato.fecha_firma)} />
        <Detail label="Fecha inicio" value={formatDateCO(contrato.fecha_inicio)} />
        <Detail label="Fecha fin" value={formatDateCO(contrato.fecha_fin)} />
      </div>

      {/* Objeto */}
      <div className="mb-5">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Objeto del contrato</p>
        <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">
          {contrato.objeto}
        </p>
      </div>

      {/* Voting section */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">
          Participacion ciudadana
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Valida o cuestiona la informacion de este contrato. Tu voto ayuda a priorizar la fiscalizacion.
        </p>
        <VoteButtons
          contratoId={contrato.id}
          validaCount={counts.valida}
          cuestionaCount={counts.cuestiona}
          userVote={userVote}
          onVote={onVote}
        />
      </div>
    </Modal>
  );
}

function StatCard({ label, value, bg, text }: { label: string; value: string; bg: string; text: string }) {
  return (
    <div className={`rounded-xl ${bg} p-3 text-center`}>
      <p className={`text-sm font-bold ${text}`}>{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}
