import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

export function CountryBarChart({ data }: { data: NetflixData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    if (!data) return [];
    const allCountries = data.flatMap((d) => d.country || []).filter(c => c && c !== "Not Specified");
    const counts = d3.rollup(allCountries, v => v.length, d => d);
    return Array.from(counts, ([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); 
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !tooltipRef.current || chartData.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 350;
    const margin = { top: 10, right: 50, bottom: 45, left: 120 };

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.count) ?? 0])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(chartData.map(d => d.country))
      .range([margin.top, height - margin.bottom])
      .padding(0.35);

    // X Axis (Added explicit numbers along bottom)
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#cbd5e1")
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px");

    // X Axis Label - VERY CLEAR EXPLANATION OF UNIT
    svg.append("text")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text("Total Distinct Content Assets (Volumes)");

    // Draw Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select(".domain").remove()) 
      .attr("font-family", "inherit")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("color", "#475569");

    // Data bars with hover logic
    svg.append("g")
      .selectAll("rect")
      .data(chartData)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.country)!)
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", "#e60a15")
      .attr("rx", 3)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
         d3.select(this).attr("opacity", 0.85);
         tooltip.style("opacity", 1)
           .html(`
             <div class="font-bold">${d.country}</div>
             <div class="text-red-200 font-medium mt-0.5">${d.count.toLocaleString()} Titles Available</div>
           `)
           .style("left", `${(event as MouseEvent).offsetX + 15}px`)
           .style("top", `${(event as MouseEvent).offsetY - 40}px`);
      })
      .on("mousemove", (event) => {
         tooltip.style("left", `${(event as MouseEvent).offsetX + 15}px`)
                .style("top", `${(event as MouseEvent).offsetY - 40}px`);
      })
      .on("mouseout", function() {
         d3.select(this).attr("opacity", 1);
         tooltip.style("opacity", 0);
      })
      .transition()
      .duration(750)
      .attr("width", d => x(d.count) - margin.left);

    // Direct labels outside bars for passive scanability
    svg.append("g")
      .selectAll("text")
      .data(chartData)
      .join("text")
      .attr("x", d => x(d.count) + 8)
      .attr("y", d => y(d.country)! + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.count.toLocaleString())
      .attr("font-size", "11px")
      .attr("font-weight", "700")
      .attr("fill", "#e60a15") 
      .attr("opacity", 0)
      .transition()
      .duration(750)
      .delay(300)
      .attr("opacity", 1);

  }, [chartData]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full min-h-[350px]">
      <svg ref={svgRef} className="h-full w-full overflow-visible" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl opacity-0 transition-opacity duration-150 border border-slate-800"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}
