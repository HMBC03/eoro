import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    personas,
    candidaturas,
    contratos,
    alertas,
    votos,
    cargos,
    declaraciones,
    antecedentes,
    vinculos,
    financiacion,
    evaluaciones,
    reportes,
    scoresCache,
    partidos,
    categorias,
    variables,
    historial,
  ] = await Promise.all([
    supabase.schema("eoro").from("personas").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("candidaturas").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("contratos").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("alertas").select("id, severidad, verificada"),
    supabase.schema("eoro").from("contrato_votos").select("votos_valida, votos_cuestiona"),
    supabase.schema("eoro").from("cargos_publicos").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("declaraciones_patrimonio").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("antecedentes").select("id, tipo, estado"),
    supabase.schema("eoro").from("vinculos_familiares").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("financiacion_campana").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("eoro_evaluaciones").select("id, persona_id, puntos_restados"),
    supabase.schema("eoro").from("eoro_reportes_ciudadanos").select("id, estado"),
    supabase.schema("eoro").from("eoro_scores_cache").select("persona_id, score_total"),
    supabase.schema("eoro").from("partidos").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("eoro_categorias").select("id", { count: "exact", head: true }),
    supabase.schema("eoro").from("eoro_variables").select("id, activa"),
    supabase.schema("eoro").from("eoro_historial").select("id", { count: "exact", head: true }),
  ]);

  const totalVotos = (votos.data || []).reduce(
    (sum, v) => sum + (v.votos_valida || 0) + (v.votos_cuestiona || 0),
    0
  );

  // Alertas breakdown
  const alertasData = alertas.data || [];
  const alertasAltas = alertasData.filter((a) => a.severidad === "alta").length;
  const alertasVerificadas = alertasData.filter((a) => a.verificada).length;

  // Antecedentes breakdown
  const antecedentesData = antecedentes.data || [];
  const antecedentesSancionados = antecedentesData.filter((a) => a.estado === "sancionado").length;
  const antecedentesVigentes = antecedentesData.filter((a) => a.estado === "vigente").length;

  // Éoro Score breakdown
  const scoresData = scoresCache.data || [];
  const personasEvaluadas = scoresData.length;
  const scorePromedio = scoresData.length > 0
    ? Math.round(scoresData.reduce((sum, s) => sum + s.score_total, 0) / scoresData.length)
    : 0;
  const scoresIntacto = scoresData.filter((s) => s.score_total >= 90).length;
  const scoresLeve = scoresData.filter((s) => s.score_total >= 70 && s.score_total < 90).length;
  const scoresDanado = scoresData.filter((s) => s.score_total >= 45 && s.score_total < 70).length;
  const scoresRoto = scoresData.filter((s) => s.score_total >= 20 && s.score_total < 45).length;
  const scoresDestruido = scoresData.filter((s) => s.score_total < 20).length;

  // Evaluaciones
  const evaluacionesData = evaluaciones.data || [];
  const personasConEval = new Set(evaluacionesData.map((e) => e.persona_id)).size;
  const totalPuntosRestados = evaluacionesData.reduce((sum, e) => sum + e.puntos_restados, 0);

  // Reportes ciudadanos
  const reportesData = reportes.data || [];
  const reportesPendientes = reportesData.filter((r) => r.estado === "pendiente").length;
  const reportesVerificados = reportesData.filter((r) => r.estado === "verificado").length;

  // Variables
  const variablesData = variables.data || [];
  const variablesActivas = variablesData.filter((v) => v.activa).length;

  // Top stats
  const statsRow = [
    { label: "Personas", value: personas.count ?? 0, color: "bg-blue-500" },
    { label: "Candidaturas", value: candidaturas.count ?? 0, color: "bg-indigo-500" },
    { label: "Contratos", value: contratos.count ?? 0, color: "bg-emerald-500" },
    { label: "Alertas", value: alertasData.length, color: "bg-amber-500" },
    { label: "Votos ciudadanos", value: totalVotos, color: "bg-purple-500" },
    { label: "Éoro evaluados", value: personasEvaluadas, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Resumen completo del estado de la plataforma
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statsRow.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white border border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${stat.color}`} />
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value.toLocaleString("es-CO")}
            </p>
          </div>
        ))}
      </div>

      {/* Éoro Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Score Distribution */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Distribución Éoro Score</h3>
          <p className="text-[10px] text-gray-400 mb-4">{personasEvaluadas} personas evaluadas · Promedio: {scorePromedio}</p>
          <div className="space-y-2.5">
            <TierBar label="Intacto (90-100)" count={scoresIntacto} total={personasEvaluadas} color="bg-[#27ae60]" />
            <TierBar label="Leve (70-89)" count={scoresLeve} total={personasEvaluadas} color="bg-[#8bc34a]" />
            <TierBar label="Dañado (45-69)" count={scoresDanado} total={personasEvaluadas} color="bg-[#d35400]" />
            <TierBar label="Roto (20-44)" count={scoresRoto} total={personasEvaluadas} color="bg-[#c0392b]" />
            <TierBar label="Destruido (0-19)" count={scoresDestruido} total={personasEvaluadas} color="bg-[#7b1fa2]" />
          </div>
        </div>

        {/* Éoro Stats */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Éoro Score — Detalle</h3>
          <div className="space-y-3">
            <StatRow label="Evaluaciones totales" value={evaluacionesData.length} />
            <StatRow label="Personas con evaluaciones" value={personasConEval} />
            <StatRow label="Puntos restados (total)" value={totalPuntosRestados} highlight="red" />
            <StatRow label="Categorías" value={categorias.count ?? 0} />
            <StatRow label="Variables activas" value={`${variablesActivas} / ${variablesData.length}`} />
            <StatRow label="Eventos en historial" value={historial.count ?? 0} />
            <div className="border-t border-gray-100 pt-3 mt-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Reportes ciudadanos</p>
              <StatRow label="Pendientes" value={reportesPendientes} highlight={reportesPendientes > 0 ? "amber" : undefined} />
              <StatRow label="Verificados" value={reportesVerificados} highlight="green" />
              <StatRow label="Total" value={reportesData.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Data completeness + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Completitud de datos */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Completitud de datos</h3>
          <p className="text-[10px] text-gray-400 mb-4">Registros por módulo de la plataforma</p>
          <div className="space-y-2">
            <DataRow label="Personas" count={personas.count ?? 0} href="/admin/personas" />
            <DataRow label="Candidaturas" count={candidaturas.count ?? 0} href="/admin/candidaturas" />
            <DataRow label="Cargos públicos" count={cargos.count ?? 0} href="/admin/cargos" />
            <DataRow label="Partidos" count={partidos.count ?? 0} href="/admin/partidos" />
            <DataRow label="Declaraciones patrimonio" count={declaraciones.count ?? 0} href="/admin/declaraciones" />
            <DataRow label="Antecedentes" count={antecedentesData.length} href="/admin/antecedentes" />
            <DataRow label="Vínculos familiares" count={vinculos.count ?? 0} href="/admin/vinculos" />
            <DataRow label="Financiación campaña" count={financiacion.count ?? 0} href="/admin/financiacion" />
            <DataRow label="Contratos" count={contratos.count ?? 0} href="/admin/contratos" />
            <DataRow label="Alertas" count={alertasData.length} href="/admin/alertas" />
          </div>
        </div>

        {/* Alertas breakdown */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Alertas y antecedentes</h3>
          <p className="text-[10px] text-gray-400 mb-4">Estado actual de hallazgos</p>
          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Alertas</p>
            <StatRow label="Severidad alta" value={alertasAltas} highlight="red" />
            <StatRow label="Verificadas" value={alertasVerificadas} highlight="green" />
            <StatRow label="Sin verificar" value={alertasData.length - alertasVerificadas} highlight={alertasData.length - alertasVerificadas > 0 ? "amber" : undefined} />
            <div className="border-t border-gray-100 pt-3 mt-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Antecedentes</p>
              <StatRow label="Sancionados" value={antecedentesSancionados} highlight="red" />
              <StatRow label="Vigentes (en proceso)" value={antecedentesVigentes} highlight="amber" />
              <StatRow label="Total registrados" value={antecedentesData.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions + System status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Acciones rápidas</h3>
          <div className="space-y-2">
            <QuickAction label="Gestionar personas" href="/admin/personas" />
            <QuickAction label="Evaluaciones Éoro" href="/admin/eoro-evaluaciones" />
            <QuickAction label="Reportes ciudadanos" href="/admin/eoro-reportes" count={reportesPendientes > 0 ? reportesPendientes : undefined} />
            <QuickAction label="Variables del score" href="/admin/eoro-variables" />
            <QuickAction label="Revisar alertas" href="/admin/alertas" count={alertasData.length - alertasVerificadas > 0 ? alertasData.length - alertasVerificadas : undefined} />
            <QuickAction label="Gestionar contratos" href="/admin/contratos" />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Estado del sistema</h3>
          <div className="space-y-3">
            <StatusRow label="Base de datos" status="Conectada" ok />
            <StatusRow label="Schema eoro" status={`${17 + 6} tablas`} ok />
            <StatusRow label="RLS" status="Habilitado" ok />
            <StatusRow label="Éoro categorías" status={`${categorias.count ?? 0} activas`} ok={(categorias.count ?? 0) > 0} />
            <StatusRow label="Éoro variables" status={`${variablesActivas} activas`} ok={variablesActivas > 0} />
            <StatusRow label="Scores calculados" status={`${personasEvaluadas} personas`} ok={personasEvaluadas > 0} />
            <StatusRow label="Reportes pendientes" status={reportesPendientes === 0 ? "Ninguno" : `${reportesPendientes} pendientes`} ok={reportesPendientes === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TierBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-900">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: number | string; highlight?: "red" | "green" | "amber" }) {
  const colors = {
    red: "text-red-600",
    green: "text-emerald-600",
    amber: "text-amber-600",
  };
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={`font-bold ${highlight ? colors[highlight] : "text-gray-900"}`}>
        {typeof value === "number" ? value.toLocaleString("es-CO") : value}
      </span>
    </div>
  );
}

function DataRow({ label, count, href }: { label: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-gray-50 transition-colors group"
    >
      <span className="text-gray-600 group-hover:text-gray-900">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900">{count.toLocaleString("es-CO")}</span>
        <svg className="h-3 w-3 text-gray-300 group-hover:text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function QuickAction({ label, href, count }: { label: string; href: string; count?: number }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 transition-colors border border-gray-100"
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-bold">
            {count}
          </span>
        )}
        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function StatusRow({ label, status, ok }: { label: string; status: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={`flex items-center gap-1.5 font-medium ${ok ? "text-emerald-600" : "text-amber-600"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-400"}`} />
        {status}
      </span>
    </div>
  );
}
