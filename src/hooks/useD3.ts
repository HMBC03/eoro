import { useRef, useEffect } from "react";
import * as d3 from "d3";

/**
 * Hook for safe D3.js rendering inside React.
 * Manages the SVG lifecycle, prevents memory leaks,
 * and ensures proper cleanup on unmount or dependency change.
 *
 * Usage:
 * const svgRef = useD3((svg) => {
 *   svg.selectAll("circle").data(data).join("circle")...
 * }, [data]);
 *
 * return <svg ref={svgRef} />;
 */
export function useD3(
  renderFn: (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ) => void,
  dependencies: unknown[]
): React.RefObject<SVGSVGElement | null> {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      renderFn(svg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
}
