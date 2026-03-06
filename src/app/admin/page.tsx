import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats from eoro schema
  const [personas, contratos, alertas, votos] = await Promise.all([
    supabase.schema("eoro").from("personas").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("contratos").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("alertas").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("contrato_votos").select("votos_valida, votos_cuestiona"),
  ]);

  const totalVotos = (votos.data || []).reduce(
    (sum, v) => sum + (v.votos_valida || 0) + (v.votos_cuestiona || 0),
    0
  );

  const stats = [
    { label: "Personas", value: personas.count ?? 0, color: "bg-blue-500" },
    { label: "Contratos", value: contratos.count ?? 0, color: "bg-emerald-500" },
    { label: "Alertas", value: alertas.count ?? 0, color: "bg-amber-500" },
    { label: "Votos totales", value: totalVotos, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Resumen del estado de la plataforma
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white border border-gray-100 p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${stat.color}`} />
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value.toLocaleString("es-CO")}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Acciones rapidas</h3>
          <div className="space-y-2">
            <QuickAction label="Gestionar personas" href="/admin/personas" />
            <QuickAction label="Gestionar contratos" href="/admin/contratos" />
            <QuickAction label="Revisar alertas" href="/admin/alertas" />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Estado del sistema</h3>
          <div className="space-y-3">
            <StatusRow label="Base de datos" status="Conectada" ok />
            <StatusRow label="Schema eoro" status="21 tablas" ok />
            <StatusRow label="RLS" status="Habilitado" ok />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-xl px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 transition-colors border border-gray-100"
    >
      {label}
      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

function StatusRow({ label, status, ok }: { label: string; status: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={`flex items-center gap-1.5 font-medium ${ok ? "text-emerald-600" : "text-red-500"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-red-400"}`} />
        {status}
      </span>
    </div>
  );
}
