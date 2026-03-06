import "server-only";

// The mapa page uses department-stats.ts which already aggregates real candidate data.
// Since getAllCandidatosReales() loads from a JSON file (server-only safe via "server-only" import),
// we just re-export the geo functions for the server component to call.

export {
  getDepartmentStats,
  getDepartmentStatsArray,
  getMetricRange,
  type MapMetric,
  type DepartmentStats,
} from "@/data/geo/department-stats";

export { getAllCandidatosReales } from "@/data/real/candidatos-reales";
