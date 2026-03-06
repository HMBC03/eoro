"use client";

import { useRef, useEffect, useState } from "react";
import type { GrafoNodo, GrafoEdge } from "@/lib/types";
import type { NodoTipo } from "@/lib/constants/grafo";
import type { SimNode } from "@/hooks/useForceGraph";
import { useForceGraph } from "@/hooks/useForceGraph";
import { NodeTooltip } from "./NodeTooltip";

interface ForceGraphProps {
  nodos: GrafoNodo[];
  edges: GrafoEdge[];
  filteredTypes: Set<NodoTipo>;
  showLabels: boolean;
  onNodeClick?: (nodeId: string) => void;
  onResetZoomRef?: (fn: () => void) => void;
}

export function ForceGraph({
  nodos,
  edges,
  filteredTypes,
  showLabels,
  onNodeClick,
  onResetZoomRef,
}: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // ResizeObserver for responsive SVG
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setSize({ width, height });
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleNodeHover = (node: SimNode | null, event?: MouseEvent) => {
    setHoveredNode(node);
    if (event) {
      setTooltipPos({ x: event.clientX, y: event.clientY });
    }
  };

  const { svgRef, resetZoom } = useForceGraph({
    nodos,
    edges,
    filteredTypes,
    showLabels,
    onNodeClick,
    onNodeHover: handleNodeHover,
  });

  // Expose reset zoom to parent
  useEffect(() => {
    onResetZoomRef?.(resetZoom);
  }, [resetZoom, onResetZoomRef]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        className="h-full w-full"
      />
      <NodeTooltip node={hoveredNode} x={tooltipPos.x} y={tooltipPos.y} />
    </div>
  );
}
