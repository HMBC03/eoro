"use client";

import { useCallback } from "react";
import Colombia from "@svg-maps/colombia";
import { getDeptBySvgId } from "@/data/geo/department-map";
import { getMetricValue } from "@/data/geo/department-stats";
import type { DepartmentStats, MapMetric } from "@/data/geo/department-stats";

interface ColombiaMapProps {
  stats: Map<string, DepartmentStats>;
  metric: MapMetric;
  colorScale: (value: number) => string;
  selectedDept: string | null;
  hoveredDept: string | null;
  onSelectDept: (svgId: string | null) => void;
  onHoverDept: (svgId: string | null) => void;
}

export function ColombiaMap({
  stats,
  metric,
  colorScale,
  selectedDept,
  hoveredDept,
  onSelectDept,
  onHoverDept,
}: ColombiaMapProps) {
  const handleClick = useCallback(
    (id: string) => {
      onSelectDept(selectedDept === id ? null : id);
    },
    [selectedDept, onSelectDept]
  );

  const handleMouseEnter = useCallback(
    (id: string) => onHoverDept(id),
    [onHoverDept]
  );

  const handleMouseLeave = useCallback(
    () => onHoverDept(null),
    [onHoverDept]
  );

  return (
    <svg
      viewBox={Colombia.viewBox}
      className="w-full h-full"
      role="img"
      aria-label="Mapa interactivo de Colombia por departamentos"
    >
      {Colombia.locations.map((location) => {
        const dept = getDeptBySvgId(location.id);
        const deptStats = dept ? stats.get(dept.svgId) : null;
        const value = deptStats ? getMetricValue(deptStats, metric) : 0;
        const isSelected = selectedDept === location.id;
        const isHovered = hoveredDept === location.id;

        return (
          <path
            key={location.id}
            d={location.path}
            fill={colorScale(value)}
            stroke={
              isSelected
                ? "#1a1a1a"
                : isHovered
                  ? "#6b7280"
                  : "#ffffff"
            }
            strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.5}
            className="cursor-pointer transition-all duration-150"
            style={isSelected ? { filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" } : undefined}
            onClick={() => handleClick(location.id)}
            onMouseEnter={() => handleMouseEnter(location.id)}
            onMouseLeave={handleMouseLeave}
            aria-label={dept?.nombre ?? location.name}
          />
        );
      })}
    </svg>
  );
}
