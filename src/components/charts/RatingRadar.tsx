import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

export function RatingRadar({ data }: { data: NetflixData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !tooltipRef.current || data.length === 0) return;

    const ratingCounts = d3.rollups(
      data.filter(d => d.rating && d.rating !== "Not Specified"),
      v => v.length,
      d => d.rating
    ).sort((a, b) => d3.descending(a[1], b[1])).slice(0, 5);

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 300;
    const radius = Math.min(width, height) / 2 - 45; // Buffer for outer labels

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();

    const g = svg.attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const angleScale = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .domain(ratingCounts.map(d => d[0]!));

    const maxCount = d3.max(ratingCounts, d => d[1]) || 1;
    const radiusScale = d3.scaleLinear().range([0, radius]).domain([0, maxCount]);

    // Circular background grid lines
    const ticks = [0.25, 0.5, 0.75, 1];
    ticks.forEach(t => {
      g.append("circle")
        .attr("r", radius * t)
        .style("fill", "none")
        .style("stroke", "#e2e8f0")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "2,2");
    });

    // Spiderweb axis lines radiating out
    ratingCounts.forEach(d => {
      const angle = angleScale(d[0]!)! + angleScale.bandwidth() / 2 - Math.PI / 2;
      g.append("line")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", Math.cos(angle) * radius)
        .attr("y2", Math.sin(angle) * radius)
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 0.5);
    });

    // Radial Line Path
    const line = d3.lineRadial<any>()
      .angle(d => angleScale(d[0])! + angleScale.bandwidth() / 2)
      .radius(d => radiusScale(d[1]))
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(ratingCounts)
      .attr("d", d => line(d) as string)
      .style("fill", "rgba(230, 10, 21, 0.2)") // Primary Brand opacity
      .style("stroke", "#e60a15")
      .style("stroke-width", 2);

    // Edge Labels & Data points
    ratingCounts.forEach(d => {
      const angle = angleScale(d[0]!)! + angleScale.bandwidth() / 2 - Math.PI / 2;
      const labelDist = radius + 20;
      const x = Math.cos(angle) * labelDist;
      const y = Math.sin(angle) * labelDist;

      // Explicit textual label of categories
      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .html(`<tspan x="${x}" dy="-0.2em" font-weight="bold">${d[0]}</tspan>
               <tspan x="${x}" dy="1.2em" fill="#94a3b8" font-size="9px">${d[1].toLocaleString()}</tspan>`) // INJECT EXACT COUNT
        .style("font-size", "10px")
        .style("fill", "#475569");

      // Plot Point Dots with Tooltips
      const pointX = Math.cos(angle) * radiusScale(d[1]);
      const pointY = Math.sin(angle) * radiusScale(d[1]);
      
      g.append("circle")
        .attr("cx", pointX)
        .attr("cy", pointY)
        .attr("r", 5)
        .style("fill", "#e60a15")
        .style("stroke", "#fff")
        .style("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function(event) {
           d3.select(this).attr("r", 7);
           tooltip.style("opacity", 1)
             .html(`
               <div class="font-bold">Maturity: ${d[0]}</div>
               <div class="text-red-200 font-semibold text-sm mt-0.5">${d[1].toLocaleString()} total</div>
             `)
             // In Radar, coordinate math requires explicit bounding conversion or simplistic mouse tracking
             .style("left", `${(event as MouseEvent).offsetX + 12}px`)
             .style("top", `${(event as MouseEvent).offsetY - 40}px`);
        })
        .on("mousemove", (event) => {
           tooltip.style("left", `${(event as MouseEvent).offsetX + 12}px`)
                  .style("top", `${(event as MouseEvent).offsetY - 40}px`);
        })
        .on("mouseout", function() {
           d3.select(this).attr("r", 5);
           tooltip.style("opacity", 0);
        });
    });

  }, [data]);

  return (
    <div ref={wrapperRef} className="relative flex h-full w-full flex-1 items-center justify-center min-h-75">
      <svg ref={svgRef} className="h-full w-full overflow-visible" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded bg-slate-900 px-3 py-2 text-xs text-white shadow-xl opacity-0 transition-opacity border border-slate-800"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}