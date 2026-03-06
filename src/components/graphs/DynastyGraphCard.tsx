"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import type { DynastyNode, DynastyEdge } from "@/lib/types";

interface DynastyGraphProps {
  candidateName: string;
  nodes: DynastyNode[];
  edges: DynastyEdge[];
  onClose: () => void;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  role: string;
  generation: number;
  isMainCandidate: boolean;
  color: string;
  ix: number;
  iy: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  relation: string;
}

const GENERATION_COLORS: Record<number, string> = {
  0: "#89B0D0",
  1: "#E76F51",
  2: "#003893",
  3: "#2D6A4F",
};

const GENERATION_LABELS: Record<number, string> = {
  0: "Abuelo/a",
  1: "Padre/Madre",
  2: "Candidato/a",
  3: "Hijo/a",
};

export function DynastyGraphCard({
  candidateName,
  nodes,
  edges,
  onClose,
}: DynastyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const buildGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    svg.attr("width", W).attr("height", H);

    // Build simulation nodes with hierarchical initial positions
    const generations = [...new Set(nodes.map((n) => n.generation))].sort();
    const yStep = H / (generations.length + 1);

    const simNodes: SimNode[] = nodes.map((n) => {
      const genIndex = generations.indexOf(n.generation);
      const genNodes = nodes.filter((nn) => nn.generation === n.generation);
      const nodeIndex = genNodes.indexOf(n);
      const xStep = W / (genNodes.length + 1);
      const ix = xStep * (nodeIndex + 1);
      const iy = yStep * (genIndex + 1);
      return { ...n, x: ix, y: iy, ix, iy };
    });

    const simLinks: SimLink[] = edges.map((e) => ({
      source: e.source,
      target: e.target,
      relation: e.relation,
    }));

    // Force simulation — scaled for full screen
    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        "link",
        d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(180).strength(0.25)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("x", d3.forceX<SimNode>((d) => d.ix).strength(0.12))
      .force("y", d3.forceY<SimNode>((d) => d.iy).strength(0.12))
      .force("collide", d3.forceCollide(65));

    // Gradient defs
    const defs = svg.append("defs");

    // Arrow marker
    defs
      .append("marker")
      .attr("id", "dynasty-arrow-fs")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 46)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L10,5 L0,10 Z")
      .attr("fill", "#9CA3AF");

    // Glow filter for main candidate
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "coloredBlur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g");

    // Links
    const link = g
      .selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "#D1D5DB")
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", "8,4")
      .attr("marker-end", "url(#dynasty-arrow-fs)");

    // Link labels
    const linkLabel = g
      .selectAll<SVGTextElement, SimLink>("text.link-label")
      .data(simLinks)
      .join("text")
      .attr("class", "link-label")
      .attr("text-anchor", "middle")
      .attr("fill", "#9CA3AF")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .text((d) => d.relation);

    // Node groups
    const node = g
      .selectAll<SVGGElement, SimNode>("g.node")
      .data(simNodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "grab");

    // Outer glow ring for main candidate
    node
      .filter((d) => d.isMainCandidate)
      .append("circle")
      .attr("r", 38)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 3)
      .attr("opacity", 0.2)
      .attr("filter", "url(#glow)");

    // Node circles
    node
      .append("circle")
      .attr("r", (d) => (d.isMainCandidate ? 28 : 20))
      .attr("fill", (d) =>
        d.isMainCandidate ? d.color : GENERATION_COLORS[d.generation] ?? "#9CA3AF"
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Initials inside circles
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .attr("font-size", (d) => (d.isMainCandidate ? "13px" : "10px"))
      .attr("font-weight", "700")
      .text((d) => {
        const parts = d.label.split(" ");
        return parts.length >= 2
          ? parts[0][0] + parts[parts.length - 1][0]
          : d.label.substring(0, 2).toUpperCase();
      });

    // Node name labels
    node
      .append("text")
      .attr("dy", (d) => (d.isMainCandidate ? 46 : 36))
      .attr("text-anchor", "middle")
      .attr("fill", "#1F2937")
      .attr("font-size", "14px")
      .attr("font-weight", (d) => (d.isMainCandidate ? "700" : "500"))
      .text((d) => d.label);

    // Role labels
    node
      .append("text")
      .attr("dy", (d) => (d.isMainCandidate ? 62 : 52))
      .attr("text-anchor", "middle")
      .attr("fill", "#9CA3AF")
      .attr("font-size", "13px")
      .text((d) => d.role);

    // Drag with spring-back
    const drag = d3
      .drag<SVGGElement, SimNode>()
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
      });

    node.call(drag);

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);

      linkLabel
        .attr("x", (d) => ((d.source as SimNode).x! + (d.target as SimNode).x!) / 2)
        .attr("y", (d) => ((d.source as SimNode).y! + (d.target as SimNode).y!) / 2 - 10);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  // Build graph on mount and resize
  useEffect(() => {
    const cleanup = buildGraph();

    const handleResize = () => {
      buildGraph();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cleanup?.();
      window.removeEventListener("resize", handleResize);
    };
  }, [buildGraph]);

  // Collect unique generations for legend
  const legendGenerations = [...new Set(nodes.map((n) => n.generation))].sort();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f5f5f0]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <h2 className="text-base font-bold text-gray-900 truncate">{candidateName}</h2>
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
            Dinastia politica
          </span>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-5">
          {legendGenerations.map((gen) => (
            <div key={gen} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: GENERATION_COLORS[gen] }}
              />
              <span className="text-xs text-gray-500">{GENERATION_LABELS[gen] ?? `Gen ${gen}`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full-screen SVG area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg ref={svgRef} className="absolute inset-0" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Animated hand hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="dynasty-hand-hint text-3xl opacity-60">
            <span role="img" aria-label="drag hint">&#x1F446;</span>
          </div>
          <style>{`
            .dynasty-hand-hint {
              animation: handDrag 4s ease-in-out infinite;
            }
            @keyframes handDrag {
              0% { transform: translate(0, 0); opacity: 0.6; }
              10% { transform: translate(0, -5px); opacity: 0.8; }
              30% { transform: translate(30px, -15px); opacity: 0.8; }
              40% { transform: translate(30px, -15px); opacity: 0.8; }
              60% { transform: translate(-20px, 10px); opacity: 0.8; }
              70% { transform: translate(-20px, 10px); opacity: 0.6; }
              80% { transform: translate(0, 0); opacity: 0.4; }
              100% { transform: translate(0, 0); opacity: 0.6; }
            }
          `}</style>
        </div>
      </div>

      {/* Mobile legend */}
      <div className="sm:hidden flex items-center justify-center gap-4 px-4 py-3 bg-white border-t border-gray-200">
        {legendGenerations.map((gen) => (
          <div key={gen} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: GENERATION_COLORS[gen] }}
            />
            <span className="text-[10px] text-gray-500">{GENERATION_LABELS[gen] ?? `Gen ${gen}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
