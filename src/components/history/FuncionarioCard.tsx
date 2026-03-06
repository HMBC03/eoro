import Link from "next/link";
import type { FuncionarioCompleto } from "@/lib/types";
import { getInitials } from "@/lib/utils";

const NIVEL_LABELS: Record<string, string> = {
  nacional: "Nacional",
  departamental: "Departamental",
  municipal: "Municipal",
};

const NIVEL_COLORS: Record<string, string> = {
  nacional: "bg-blue-50 text-blue-700",
  departamental: "bg-purple-50 text-purple-700",
  municipal: "bg-teal-50 text-teal-700",
};

export function FuncionarioCard({ funcionario }: { funcionario: FuncionarioCompleto }) {
  const { persona, cargo_actual, historial_cargos, antecedentes } = funcionario;
  const antecedentesVigentes = antecedentes.filter((a) => a.estado === "vigente").length;

  // Calculate years of public service
  const firstCargo = historial_cargos.reduce((earliest, c) => {
    return c.fecha_inicio < earliest ? c.fecha_inicio : earliest;
  }, historial_cargos[0]?.fecha_inicio ?? "2024-01-01");
  const yearsService = new Date().getFullYear() - new Date(firstCargo).getFullYear();

  return (
    <Link
      href={`/historial/${persona.id}`}
      className="group block rounded-2xl bg-white p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-600 text-sm font-bold text-white">
          {getInitials(persona.nombre_completo)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
            {persona.nombre_completo}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 truncate">
            {cargo_actual.cargo}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              {cargo_actual.entidad}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${NIVEL_COLORS[cargo_actual.nivel] ?? "bg-gray-100 text-gray-500"}`}>
              {NIVEL_LABELS[cargo_actual.nivel] ?? cargo_actual.nivel}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
            <span>{cargo_actual.departamento}</span>
            <span>{yearsService} anos en servicio</span>
          </div>
        </div>
      </div>

      {/* Alert indicators */}
      {antecedentesVigentes > 0 && (
        <div className="mt-3 flex gap-2 border-t border-gray-50 pt-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3e2] px-2 py-0.5 text-[10px] font-medium text-[#d35400]">
            <span className="h-1 w-1 rounded-full bg-[#f39c12]" />
            {antecedentesVigentes} antecedente{antecedentesVigentes > 1 ? "s" : ""} vigente{antecedentesVigentes > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </Link>
  );
}
