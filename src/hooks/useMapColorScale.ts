"use client";

import { useMemo } from "react";
import * as d3 from "d3";
import type { MapMetric, DepartmentStats } from "@/data/geo/department-stats";
import { getMetricValue } from "@/data/geo/department-stats";

const COLOR_RANGES: Record<MapMetric, [string, string]> = {
  candidatos: ["#f0fdf4", "#1B4332"], // light green -> civic.trust
  contratos: ["#f0f9ff", "#264653"],   // light blue -> viz.info
  alertas: ["#fef2f2", "#E76F51"],     // light red -> viz.danger
};

export function useMapColorScale(
  stats: DepartmentStats[],
  metric: MapMetric
): (value: number) => string {
  return useMemo(() => {
    const values = stats.map((s) => getMetricValue(s, metric));
    const maxVal = d3.max(values) ?? 1;

    return d3
      .scaleLinear<string>()
      .domain([0, maxVal])
      .range(COLOR_RANGES[metric])
      .interpolate(d3.interpolateRgb)
      .clamp(true);
  }, [stats, metric]);
}
