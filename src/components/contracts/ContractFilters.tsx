"use client";

import { SearchBar } from "@/components/ui/SearchBar";

interface ContractFiltersProps {
  departamento: string;
  entidad: string;
  estado: string;
  busqueda: string;
  departamentos: string[];
  entidades: string[];
  onDepartamentoChange: (v: string) => void;
  onEntidadChange: (v: string) => void;
  onEstadoChange: (v: string) => void;
  onBusquedaChange: (v: string) => void;
  onReset: () => void;
}

const ESTADOS = [
  { value: "todos", label: "Todos los estados" },
  { value: "activo", label: "Activo" },
  { value: "finalizado", label: "Finalizado" },
  { value: "liquidado", label: "Liquidado" },
  { value: "terminado_anticipadamente", label: "Terminado anticipadamente" },
];

export function ContractFilters({
  departamento,
  entidad,
  estado,
  busqueda,
  departamentos,
  entidades,
  onDepartamentoChange,
  onEntidadChange,
  onEstadoChange,
  onBusquedaChange,
  onReset,
}: ContractFiltersProps) {
  const hasFilters = departamento !== "todos" || entidad !== "todos" || estado !== "todos" || busqueda.length > 0;

  return (
    <div className="sticky top-[60px] z-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-sm p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px]">
          <SearchBar
            onSearch={onBusquedaChange}
            placeholder="Buscar contratista, entidad u objeto..."
            size="sm"
          />
        </div>

        <select
          value={departamento}
          onChange={(e) => onDepartamentoChange(e.target.value)}
          className="rounded-full bg-gray-100/70 px-3 py-2 text-xs text-gray-600 border-0 focus:ring-2 focus:ring-gray-300 cursor-pointer"
        >
          <option value="todos">Departamento</option>
          {departamentos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={entidad}
          onChange={(e) => onEntidadChange(e.target.value)}
          className="rounded-full bg-gray-100/70 px-3 py-2 text-xs text-gray-600 border-0 focus:ring-2 focus:ring-gray-300 cursor-pointer"
        >
          <option value="todos">Entidad</option>
          {entidades.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="rounded-full bg-gray-100/70 px-3 py-2 text-xs text-gray-600 border-0 focus:ring-2 focus:ring-gray-300 cursor-pointer"
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={onReset}
            className="rounded-full bg-gray-100/70 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200/70 transition-all"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
