import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

export function DurationChart({ data }: { data: NetflixData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const processedData = useMemo(() => {
    if (!data) return [];
    return data
      .filter(d => d.type === "Movie" && d.duration && d.duration.includes("min"))
      .map(d => {
        const durStr = d.duration as string; 
        const val = parseInt((durStr.split(" ")[0]) || "0");
        return isNaN(val) ? 0 : val;
      })
      .filter(v => v > 0 && v < 300); 
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !tooltipRef.current || processedData.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 320;
    const margin = { top: 25, right: 30, bottom: 50, left: 55 };

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(processedData) ?? 200])
      .nice()
      .range([margin.left, width - margin.right]);

    const histogram = d3.bin<number, number>()
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(20)); 

    const bins = histogram(processedData);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) ?? 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // X Axis
    const xAxis = svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => `${d}`))
      .attr("color", "#94a3b8");

    // X Axis Title
    svg.append("text")
      .attr("x", (width + margin.left) / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text("Movie Duration (Minutes)");

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#94a3b8")
      .call(g => g.select(".domain").remove());

    // Y Axis Title (Vertical rotated)
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 12)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text("Number of Movies");

    // Grid Lines
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.4)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .call(g => g.select(".domain").remove());

    // Render & Interactions
    svg.selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", d => x(d.x0!) + 1)
      .attr("width", d => Math.max(0, x(d.x1!) - x(d.x0!) - 1))
      .attr("y", height - margin.bottom) 
      .attr("height", 0)
      .attr("fill", "#e60a15") 
      .attr("rx", 3)
      .attr("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#b91c1c"); // Darken slightly on hover
        tooltip.style("opacity", 1)
          .html(`
            <div class="font-semibold text-slate-100">Range: ${d.x0} - ${d.x1} min</div>
            <div class="text-white text-base font-bold mt-0.5">${d.length} Titles</div>
          `)
          .style("left", `${(event as MouseEvent).offsetX + 10}px`)
          .style("top", `${(event as MouseEvent).offsetY - 50}px`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${(event as MouseEvent).offsetX + 10}px`)
          .style("top", `${(event as MouseEvent).offsetY - 50}px`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#e60a15");
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attr("y", d => y(d.length))
      .attr("height", d => height - margin.bottom - y(d.length));

  }, [processedData]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full min-h-[320px]">
      <svg ref={svgRef} className="h-full w-full overflow-visible" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded bg-slate-900 px-3 py-2 text-xs text-white shadow-xl opacity-0 transition-opacity duration-200 border border-slate-700"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}
