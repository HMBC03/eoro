"use client";

import { useState, useMemo } from "react";
import { useContractVotes } from "@/hooks/useContractVotes";
import { ContractFilters } from "@/components/contracts/ContractFilters";
import { ContractTable } from "@/components/contracts/ContractTable";
import { ContractDetail } from "@/components/contracts/ContractDetail";
import { ContractCharts } from "@/components/contracts/ContractCharts";
import { formatCOPShort } from "@/lib/formatters";
import type { ContratoConVotos } from "@/lib/types";
import type { ContratoScore } from "@/lib/contract-score";

interface ContratosStats {
  totalContratos: number;
  valorTotal: number;
  promedioValor: number;
  activos: number;
  porEstado: Record<string, number>;
  porDepartamento: { nombre: string; count: number; valor: number }[];
  porMes: { fecha: string; count: number; valor: number }[];
  entidadesTop: { nombre: string; count: number; valor: number }[];
}

interface ContratosClientProps {
  contratos: ContratoConVotos[];
  scores: Record<string, ContratoScore>;
  stats: ContratosStats;
}

export default function ContratosClient({ contratos, scores: scoresRecord, stats }: ContratosClientProps) {
  const [departamento, setDepartamento] = useState("todos");
  const [entidad, setEntidad] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Rebuild Map from serialized Record
  const scores = useMemo(() => new Map(Object.entries(scoresRecord)), [scoresRecord]);

  // Build initial vote counts from server data
  const initialCounts = useMemo(() => {
    const counts: Record<string, { valida: number; cuestiona: number }> = {};
    for (const c of contratos) {
      counts[c.id] = { valida: c.votos_valida, cuestiona: c.votos_cuestiona };
    }
    return counts;
  }, [contratos]);

  const { vote, getUserVote, getCounts } = useContractVotes(initialCounts);

  const filtered = useMemo(() => {
    let arr = contratos;
    if (departamento !== "todos") arr = arr.filter((c) => c.departamento === departamento);
    if (entidad !== "todos") arr = arr.filter((c) => c.entidad_nombre === entidad);
    if (estado !== "todos") arr = arr.filter((c) => c.estado === estado);
    if (busqueda.length > 1) {
      const q = busqueda.toLowerCase();
      arr = arr.filter(
        (c) =>
          c.contratista_nombre.toLowerCase().includes(q) ||
          c.entidad_nombre.toLowerCase().includes(q) ||
          c.objeto.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [contratos, departamento, entidad, estado, busqueda]);

  const departamentos = useMemo(
    () => [...new Set(contratos.map((c) => c.departamento))].sort(),
    [contratos]
  );
  const entidades = useMemo(
    () => [...new Set(contratos.map((c) => c.entidad_nombre))].sort(),
    [contratos]
  );

  const selectedContrato = selectedId
    ? contratos.find((c) => c.id === selectedId) ?? null
    : null;

  function resetFilters() {
    setDepartamento("todos");
    setEntidad("todos");
    setEstado("todos");
    setBusqueda("");
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light text-gray-900">
            Contratos <span className="font-bold">Nacionales</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Dashboard de contratacion publica con datos SECOP. Filtra, busca y valida informacion contractual.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total contratos" value={stats.totalContratos.toLocaleString("es-CO")} icon="doc" />
          <StatCard label="Valor total" value={formatCOPShort(stats.valorTotal)} icon="money" />
          <StatCard label="Entidades" value={stats.entidadesTop.length.toString()} icon="building" />
          <StatCard label="Departamentos" value={stats.porDepartamento.length.toString()} icon="map" />
        </div>

        {/* Charts */}
        <ContractCharts
          porDepartamento={stats.porDepartamento}
          porMes={stats.porMes}
        />

        {/* Filters */}
        <ContractFilters
          departamento={departamento}
          entidad={entidad}
          estado={estado}
          busqueda={busqueda}
          departamentos={departamentos}
          entidades={entidades}
          onDepartamentoChange={setDepartamento}
          onEntidadChange={setEntidad}
          onEstadoChange={setEstado}
          onBusquedaChange={setBusqueda}
          onReset={resetFilters}
        />

        {/* Results count */}
        <p className="text-xs text-gray-400">
          {filtered.length} contrato{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <ContractTable
          contratos={filtered}
          scores={scores}
          onSelectContrato={setSelectedId}
          getUserVote={getUserVote}
          getCounts={getCounts}
          onVote={vote}
        />

        {/* Detail modal */}
        <ContractDetail
          contrato={selectedContrato}
          score={selectedId ? scores.get(selectedId) ?? null : null}
          isOpen={!!selectedContrato}
          onClose={() => setSelectedId(null)}
          userVote={selectedId ? getUserVote(selectedId) : null}
          counts={selectedId ? getCounts(selectedId) : { valida: 0, cuestiona: 0 }}
          onVote={vote}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    doc: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    money: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    building: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    map: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-[#c4e615]">
        {icons[icon]}
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-[11px] text-gray-400">{label}</p>
      </div>
    </div>
  );
}
