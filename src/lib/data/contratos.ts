import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ContratoConVotos } from "@/lib/types";
import { calculateContratoScore, calculateAllScores, type ContratoScore } from "@/lib/contract-score";

export async function getContratos(): Promise<ContratoConVotos[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("contratos")
    .select("*, contrato_votos(votos_valida, votos_cuestiona)")
    .order("fecha_firma", { ascending: false });

  return (data ?? []).map((c) => ({
    id: c.id,
    secop_id: c.secop_id ?? "",
    entidad_nombre: c.entidad_nombre,
    entidad_nit: c.entidad_nit,
    contratista_nombre: c.contratista_nombre,
    contratista_nit: c.contratista_nit,
    objeto: c.objeto,
    valor_contrato: Number(c.valor_contrato),
    valor_adiciones: Number(c.valor_adiciones),
    modalidad: c.modalidad,
    estado: c.estado,
    fecha_firma: c.fecha_firma,
    fecha_inicio: c.fecha_inicio,
    fecha_fin: c.fecha_fin,
    departamento: c.departamento,
    municipio: c.municipio,
    votos_valida: c.contrato_votos?.[0]?.votos_valida ?? 0,
    votos_cuestiona: c.contrato_votos?.[0]?.votos_cuestiona ?? 0,
  }));
}

export async function getFamilyNits(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.schema("eoro").from("family_nits").select("nit");
  return new Set((data ?? []).map((r) => r.nit));
}

export async function getContratosWithScores() {
  const [contratos, familyNits] = await Promise.all([
    getContratos(),
    getFamilyNits(),
  ]);

  const scores = new Map<string, ContratoScore>();
  for (const c of contratos) {
    scores.set(c.id, calculateContratoScore(c, contratos, familyNits));
  }

  // Stats
  const totalContratos = contratos.length;
  const valorTotal = contratos.reduce((s, c) => s + c.valor_contrato, 0);
  const promedioValor = totalContratos > 0 ? Math.round(valorTotal / totalContratos) : 0;
  const activos = contratos.filter((c) => c.estado === "activo").length;

  const porEstado: Record<string, number> = {};
  for (const c of contratos) {
    porEstado[c.estado] = (porEstado[c.estado] || 0) + 1;
  }

  const deptMap = new Map<string, { count: number; valor: number }>();
  for (const c of contratos) {
    const d = deptMap.get(c.departamento) || { count: 0, valor: 0 };
    d.count++;
    d.valor += c.valor_contrato;
    deptMap.set(c.departamento, d);
  }
  const porDepartamento = [...deptMap.entries()]
    .map(([nombre, d]) => ({ nombre, count: d.count, valor: d.valor }))
    .sort((a, b) => b.count - a.count);

  const mesMap = new Map<string, { count: number; valor: number }>();
  for (const c of contratos) {
    const fecha = c.fecha_firma.substring(0, 7);
    const d = mesMap.get(fecha) || { count: 0, valor: 0 };
    d.count++;
    d.valor += c.valor_contrato;
    mesMap.set(fecha, d);
  }
  const porMes = [...mesMap.entries()]
    .map(([fecha, d]) => ({ fecha, count: d.count, valor: d.valor }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const entMap = new Map<string, { count: number; valor: number }>();
  for (const c of contratos) {
    const d = entMap.get(c.entidad_nombre) || { count: 0, valor: 0 };
    d.count++;
    d.valor += c.valor_contrato;
    entMap.set(c.entidad_nombre, d);
  }
  const entidadesTop = [...entMap.entries()]
    .map(([nombre, d]) => ({ nombre, count: d.count, valor: d.valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10);

  const stats = {
    totalContratos,
    valorTotal,
    promedioValor,
    activos,
    porEstado,
    porDepartamento,
    porMes,
    entidadesTop,
  };

  return { contratos, scores, stats };
}
