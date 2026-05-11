import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

interface NodeData extends d3.SimulationNodeDatum {
  name: string;
  count: number;
  r: number;
  rank: number;
  x?: number;
  y?: number;
}

export function CastBubbleChart({ data }: { data: NetflixData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const allCast = data.flatMap(d => d.cast || []).filter(c => c && c !== "Not Specified");
    const counts = d3.rollup(
      allCast,
      v => v.length,
      d => d
    );

    const sorted = Array.from(counts, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);

    const sizeScale = d3.scaleSqrt()
      .domain([d3.min(sorted, d => d.count) || 0, d3.max(sorted, d => d.count) || 1])
      .range([25, 65]);

    return sorted.map((d, index) => ({
      ...d,
      r: sizeScale(d.count),
      rank: index + 1 // Injected Rank tracking
    })) as NodeData[];
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !tooltipRef.current || chartData.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 450;
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const minCount = chartData[chartData.length - 1]?.count ?? 0;
    const maxCount = chartData[0]?.count ?? 10;

    // VASTLY IMPROVED CONTRAST SCALE: Distinguishes the hierarchy clearly from mute to intense
    const colorScale = d3.scaleLinear<string>()
      .domain([minCount, (minCount + maxCount) / 2, maxCount])
      .range(["#cbd5e1", "#fca5a5", "#e60a15"]); // Gray/Mute -> Light Red -> Deep Alert Red

    const nodes = chartData.map(d => ({ ...d }));
    const g = svg.append("g");

    const nodeElements = g.selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer");

    nodeElements.append("circle")
      .attr("r", d => d.r)
      .attr("fill", (d: any) => colorScale(d.count))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.95);

    // Explicit Rank Badge inside top of circle to clear confusion
    nodeElements.append("text")
      .text((d: any) => `#${d.rank}`)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.6em")
      .attr("fill", (d: any) => d.rank > 15 ? "#475569" : "white")
      .attr("font-size", d => Math.max(8, d.r / 5))
      .attr("font-weight", "bold")
      .attr("opacity", 0.8)
      .attr("pointer-events", "none");

    // TOOLTIP Logic applied to element mouse interactions
    nodeElements.on("mouseover", function(event, d) {
      d3.select(this).select("circle").transition().duration(150).attr("opacity", 1).attr("stroke-width", 3);
      
      tooltip.style("opacity", "1")
        .html(`
          <div class="font-bold text-white">${d.name}</div>
          <div class="text-white/80 text-xs mt-0.5">${d.count} total productions</div>
        `)
        .style("left", `${(event as MouseEvent).offsetX + 15}px`)
        .style("top", `${(event as MouseEvent).offsetY - 40}px`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", `${(event as MouseEvent).offsetX + 15}px`)
        .style("top", `${(event as MouseEvent).offsetY - 40}px`);
    })
    .on("mouseout", function() {
      d3.select(this).select("circle").transition().duration(150).attr("opacity", 0.95).attr("stroke-width", 1.5);
      tooltip.style("opacity", "0");
    });

    nodeElements.append("text")
      .text(d => {
        const spaceIdx = d.name.lastIndexOf(" ");
        return spaceIdx > 0 ? d.name.substring(spaceIdx + 1) : d.name;
      })
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white")
      .attr("font-size", d => Math.max(10, d.r / 3.5))
      .attr("font-weight", "600")
      .attr("pointer-events", "none");
    
    nodeElements.append("text")
      .text(d => `${d.count}`)
      .attr("text-anchor", "middle")
      .attr("dy", "1.6em")
      .attr("fill", "rgba(255, 255, 255, 0.7)")
      .attr("font-size", d => Math.max(9, d.r / 4.5))
      .attr("font-weight", "bold")
      .attr("pointer-events", "none");

    const simulation = d3.forceSimulation<NodeData>(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(8)) 
      .force("collide", d3.forceCollide<NodeData>().radius(d => d.r + 2).iterations(2)) 
      .on("tick", () => {
        nodeElements.attr("transform", d => `translate(${Math.max(d.r, Math.min(width - d.r, d.x!))},${Math.max(d.r, Math.min(height - d.r, d.y!))})`);
      });

    return () => {
      simulation.stop();
    };
  }, [chartData]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full min-h-[450px]">
      <svg ref={svgRef} className="h-full w-full" />
      {/* HTML Tooltip container identical in design to user's existing components */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl opacity-0 transition-opacity duration-150"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}
