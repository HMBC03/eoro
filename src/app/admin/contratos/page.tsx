import { createClient } from "@/lib/supabase/server";
import { deleteContrato } from "../actions";
import { formatCOPShort } from "@/lib/formatters";

export default async function AdminContratosPage() {
  const supabase = await createClient();
  const { data: contratos } = await supabase
    .schema("eoro")
    .from("contratos")
    .select("id, entidad_nombre, contratista_nombre, objeto, valor_contrato, estado, departamento, fecha_firma")
    .order("fecha_firma", { ascending: false });

  const rows = contratos ?? [];

  const ESTADO_STYLES: Record<string, string> = {
    activo: "bg-emerald-50 text-emerald-700",
    finalizado: "bg-blue-50 text-blue-700",
    liquidado: "bg-gray-100 text-gray-500",
    terminado_anticipadamente: "bg-red-50 text-red-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
        <p className="text-sm text-gray-400 mt-1">{rows.length} registros en SECOP</p>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                <th className="px-5 py-3">Entidad</th>
                <th className="px-5 py-3">Contratista</th>
                <th className="px-5 py-3">Objeto</th>
                <th className="px-5 py-3 text-right">Valor</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Depto.</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                    {c.entidad_nombre}
                  </td>
                  <td className="px-5 py-3 text-gray-700 max-w-[150px] truncate">
                    {c.contratista_nombre}
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">
                    {c.objeto}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                    {formatCOPShort(Number(c.valor_contrato))}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${ESTADO_STYLES[c.estado] ?? "bg-gray-100 text-gray-500"}`}>
                      {c.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{c.departamento}</td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{c.fecha_firma}</td>
                  <td className="px-5 py-3 text-right">
                    <form action={deleteContrato.bind(null, c.id)} className="inline">
                      <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-medium">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
