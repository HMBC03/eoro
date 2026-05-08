// ============================================================
// Department statistics aggregated from real candidate data
// ============================================================

import { getPresidenciales2026 } from "@/data/mock/presidenciales-2026";
import { DEPARTMENT_MAP, getDeptByNombre } from "./department-map";

export type MapMetric = "candidatos" | "contratos" | "alertas";

export interface DepartmentStats {
  svgId: string;
  codigoDane: string;
  nombre: string;
  capital: string;
  numCandidatos: number;
  numPresidenciales: number;
  topPartidos: { nombre: string; sigla: string; color: string; count: number }[];
  numContratos: number;
  valorContratos: number;
  numAlertas: number;
}

// --- Cached computation ---

let _statsMap: Map<string, DepartmentStats> | null = null;

function buildStats(): Map<string, DepartmentStats> {
  const candidatos = getPresidenciales2026();

  const byDept = new Map<string, typeof candidatos>();
  for (const c of candidatos) {
    const dep = c.persona.departamento_origen;
    if (dep === "Colombia" || dep === "Internacional") continue;
    const arr = byDept.get(dep) || [];
    arr.push(c);
    byDept.set(dep, arr);
  }

  const result = new Map<string, DepartmentStats>();

  for (const mapping of DEPARTMENT_MAP) {
    const deptCandidatos = byDept.get(mapping.nombre) || [];
    const numCandidatos = deptCandidatos.length;

    const numPresidenciales = deptCandidatos.filter(
      (c) => c.candidatura_actual.tipo === "presidencia"
    ).length;

    // Top parties
    const partyCount = new Map<string, { nombre: string; sigla: string; color: string; count: number }>();
    for (const c of deptCandidatos) {
      const pid = c.partido.id;
      const existing = partyCount.get(pid);
      if (existing) {
        existing.count++;
      } else {
        partyCount.set(pid, {
          nombre: c.partido.nombre,
          sigla: c.partido.sigla,
          color: c.partido.color_hex,
          count: 1,
        });
      }
    }
    const topPartidos = [...partyCount.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Mock contracts & alerts (deterministic, proportional to candidates)
    const seed = hashCode(mapping.nombre);
    const numContratos = Math.max(5, Math.round(numCandidatos * 1.8 + (seed % 50)));
    const valorContratos = numContratos * (150_000_000 + (seed % 500_000_000));
    const numAlertas = Math.max(0, Math.round(numCandidatos * 0.15 + (seed % 5)));

    result.set(mapping.svgId, {
      svgId: mapping.svgId,
      codigoDane: mapping.codigoDane,
      nombre: mapping.nombre,
      capital: mapping.capital,
      numCandidatos,
      numPresidenciales,
      topPartidos,
      numContratos,
      valorContratos,
      numAlertas,
    });
  }

  return result;
}

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getDepartmentStats(): Map<string, DepartmentStats> {
  if (!_statsMap) _statsMap = buildStats();
  return _statsMap;
}

export function getDepartmentStatsArray(): DepartmentStats[] {
  return [...getDepartmentStats().values()];
}

export function getMetricValue(stats: DepartmentStats, metric: MapMetric): number {
  switch (metric) {
    case "candidatos":
      return stats.numCandidatos;
    case "contratos":
      return stats.numContratos;
    case "alertas":
      return stats.numAlertas;
  }
}

export function getMetricRange(metric: MapMetric): { min: number; max: number } {
  const arr = getDepartmentStatsArray();
  const values = arr.map((s) => getMetricValue(s, metric));
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
