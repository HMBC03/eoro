"use client";

import { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import type { GrafoNodo, GrafoEdge } from "@/lib/types";
import type { NodoTipo } from "@/lib/constants/grafo";

// Extended node/link types for D3 simulation
export interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  tipo: NodoTipo;
  color: string;
  metadata: Record<string, unknown>;
}

export interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  tipo: string;
  label: string;
  peso: number;
}

const NODE_RADIUS: Record<NodoTipo, number> = {
  candidato: 18,
  familiar: 12,
  cargo: 10,
  contratista: 12,
  partido: 22,
};

const EDGE_COLORS: Record<string, string> = {
  familiar: "#E76F51",
  cargo: "#89B0D0",
  contrato: "#2D6A4F",
  partido: "#9CA3AF",
  financiador: "#D97706",
};

interface UseForceGraphOptions {
  nodos: GrafoNodo[];
  edges: GrafoEdge[];
  filteredTypes: Set<NodoTipo>;
  showLabels: boolean;
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (node: SimNode | null, event?: MouseEvent) => void;
}

export function useForceGraph({
  nodos,
  edges,
  filteredTypes,
  showLabels,
  onNodeClick,
  onNodeHover,
}: UseForceGraphOptions) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    const width = svgEl.clientWidth || 800;
    const height = svgEl.clientHeight || 600;

    // Clear previous
    svg.selectAll("*").remove();

    // Filter nodes by type
    const visibleNodes: SimNode[] = nodos
      .filter((n) => filteredTypes.has(n.tipo as NodoTipo))
      .map((n) => ({ ...n }));

    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    const visibleLinks: SimLink[] = edges
      .filter((e) => visibleIds.has(e.source as string) && visibleIds.has(e.target as string))
      .map((e) => ({ ...e, source: e.source as string, target: e.target as string }));

    // Container group for zoom/pan
    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Arrow markers for edges
    svg.append("defs").selectAll("marker")
      .data(Object.keys(EDGE_COLORS))
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -3 6 6")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-3L6,0L0,3")
      .attr("fill", (d) => EDGE_COLORS[d] || "#9CA3AF");

    // Simulation
    const simulation = d3.forceSimulation<SimNode>(visibleNodes)
      .force("link", d3.forceLink<SimNode, SimLink>(visibleLinks).id((d) => d.id).distance(80).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide<SimNode>().radius((d) => NODE_RADIUS[d.tipo] + 4));

    simulationRef.current = simulation;

    // Draw edges
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(visibleLinks)
      .join("line")
      .attr("stroke", (d) => EDGE_COLORS[d.tipo] || "#9CA3AF")
      .attr("stroke-width", (d) => Math.max(1, d.peso * 0.8))
      .attr("stroke-opacity", 0.5)
      .attr("marker-end", (d) => `url(#arrow-${d.tipo})`);

    // Edge labels
    const edgeLabel = g.append("g")
      .attr("class", "edge-labels")
      .selectAll("text")
      .data(visibleLinks)
      .join("text")
      .attr("font-size", 8)
      .attr("fill", "#9CA3AF")
      .attr("text-anchor", "middle")
      .attr("dy", -4)
      .text((d) => d.label)
      .style("display", showLabels ? "block" : "none");

    // Draw nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(visibleNodes)
      .join("circle")
      .attr("r", (d) => NODE_RADIUS[d.tipo])
      .attr("fill", (d) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .on("click", (_event, d) => onNodeClick?.(d.id))
      .on("mouseenter", (event, d) => onNodeHover?.(d, event as MouseEvent))
      .on("mouseleave", () => onNodeHover?.(null))
      .call(
        d3.drag<SVGCircleElement, SimNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node labels
    const nodeLabel = g.append("g")
      .attr("class", "node-labels")
      .selectAll("text")
      .data(visibleNodes)
      .join("text")
      .attr("font-size", 9)
      .attr("font-weight", (d) => d.tipo === "candidato" || d.tipo === "partido" ? "600" : "400")
      .attr("fill", "#374151")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => NODE_RADIUS[d.tipo] + 12)
      .text((d) => d.label)
      .style("display", showLabels ? "block" : "none")
      .style("pointer-events", "none");

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);

      edgeLabel
        .attr("x", (d) => ((d.source as SimNode).x! + (d.target as SimNode).x!) / 2)
        .attr("y", (d) => ((d.source as SimNode).y! + (d.target as SimNode).y!) / 2);

      node
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!);

      nodeLabel
        .attr("x", (d) => d.x!)
        .attr("y", (d) => d.y!);
    });

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodos, edges, filteredTypes, showLabels]);

  return { svgRef, resetZoom };
}
