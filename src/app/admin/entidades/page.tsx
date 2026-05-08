import { createClient } from "@/lib/supabase/server";
import { createEntidad, updateEntidad, deleteEntidad } from "../actions-presupuesto";

export default async function AdminEntidadesPage() {
  const supabase = await createClient();

  const { data: entidades } = await supabase
    .schema("eoro")
    .from("entidad_estado")
    .select("*")
    .eq("activo", true)
    .order("orden");

  const rows = (entidades ?? []) as unknown as {
    id: string;
    nombre: string;
    sigla: string;
    categoria: string;
    subcategoria: string | null;
    nit: string | null;
    presupuesto_asignado: number;
    presupuesto_ejecutado: number;
    porcentaje_ejecucion: number;
    num_contratos: number;
    color_hex: string;
    orden: number;
  }[];

  const CATEGORIAS = [
    { value: "recaudo", label: "Recaudo e Ingresos" },
    { value: "presupuesto", label: "Presupuesto y Ejecución" },
    { value: "contratacion", label: "Contratación Pública" },
    { value: "control", label: "Órganos de Control" },
    { value: "activos", label: "Gestión de Activos" },
    { value: "datos", label: "Datos Abiertos" },
  ];

  const INPUT = "rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entidades del Estado</h1>
          <p className="text-sm text-gray-400 mt-1">{rows.length} registros</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {CATEGORIAS.map((cat) => {
          const count = rows.filter((r) => r.categoria === cat.value).length;
          return (
            <div key={cat.value} className="rounded-xl bg-white border border-gray-100 p-3">
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-[10px] text-gray-400 uppercase">{cat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {rows.map((e) => (
          <div key={e.id} className="rounded-2xl bg-white border border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: e.color_hex }}
              >
                {e.sigla?.slice(0, 3) || "XX"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{e.nombre}</p>
                <p className="text-xs text-gray-400">
                  {e.sigla} · {e.categoria}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {e.presupuesto_asignado ? fmt(e.presupuesto_asignado) : "—"}
                </p>
                <p className="text-[10px] text-gray-400">
                  {e.porcentaje_ejecucion ? `${e.porcentaje_ejecucion}%` : "—"} ejec.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}