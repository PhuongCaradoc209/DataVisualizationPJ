import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

export function AcquisitionScatter({ data }: { data: NetflixData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !tooltipRef.current || data.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 320;
    
    const margin = { top: 35, right: 25, bottom: 50, left: 60 };
    const validData = data.filter(d => d.release_year && d.year_added);

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3.scaleLinear()
      .domain([d3.min(validData, d => d.release_year)! - 2, d3.max(validData, d => d.release_year)! + 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([d3.min(validData, d => d.year_added)! - 1, d3.max(validData, d => d.year_added)! + 1])
      .range([height - margin.bottom, margin.top]);

    // Bottom Axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .attr("color", "#94a3b8");
    
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - 10)
      .text("Production Release Year")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .attr("font-weight", "600");

    // Left Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format("d")))
      .attr("color", "#94a3b8");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)") 
      .attr("y", 18) 
      .attr("x", -((height - margin.bottom + margin.top) / 2))
      .text("Year Added to Netflix")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .attr("font-weight", "600");

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("opacity", 0.15)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .attr("color", "#94a3b8");

    // Add Diagonal Reference Line (Perfect Sync: Added same year as release)
    const minLim = Math.max(x.domain()[0]!, y.domain()[0]!);
    const maxLim = Math.min(x.domain()[1]!, y.domain()[1]!);
    svg.append("line")
      .attr("x1", x(minLim)!)
      .attr("y1", y(minLim)!)
      .attr("x2", x(maxLim)!)
      .attr("y2", y(maxLim)!)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.5);

    // Scatter Points
    svg.append("g")
      .selectAll("circle")
      .data(validData)
      .join("circle")
      .attr("cx", d => x(d.release_year!)!)
      .attr("cy", d => y(d.year_added!)!)
      .attr("r", 4.5)
      .attr("fill", d => d.type === "Movie" ? "#e60a15" : "#f59e0b")
      .attr("opacity", 0.5)
      .attr("cursor", "pointer")
      .on("mouseover", function(event, d) {
         d3.select(this).attr("opacity", 1).attr("r", 7).attr("stroke", "#fff").attr("stroke-width", 1);
         const gap = (d.year_added || 0) - (d.release_year || 0);
         tooltip.style("opacity", 1)
           .html(`
             <div class="font-bold text-slate-50 truncate max-w-[200px]">${d.title}</div>
             <div class="text-slate-400 text-xs mt-0.5">Released: ${d.release_year} • Added: ${d.year_added}</div>
             <div class="mt-1 text-[10px] px-1.5 py-0.5 rounded inline-block ${gap <= 1 ? 'bg-emerald-900/50 text-emerald-300' : 'bg-blue-900/50 text-blue-300'}">
               ${gap <= 0 ? 'Day One Sync' : `Latency: ${gap} yr(s)`}
             </div>
           `)
           .style("left", `${(event as MouseEvent).offsetX + 15}px`)
           .style("top", `${(event as MouseEvent).offsetY - 60}px`);
      })
      .on("mousemove", (event) => {
         tooltip.style("left", `${(event as MouseEvent).offsetX + 15}px`)
                .style("top", `${(event as MouseEvent).offsetY - 60}px`);
      })
      .on("mouseout", function() {
         d3.select(this).attr("opacity", 0.5).attr("r", 4.5).attr("stroke", "none");
         tooltip.style("opacity", 0);
      });

    // Small explicit inline legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 110}, 10)`);
    
    const legendData: Array<[string, string]> = [['Movie', '#e60a15'], ['TV Show', '#f59e0b']];
    legendData.forEach((item, i) => {
       const g = legend.append("g").attr("transform", `translate(0, ${i * 14})`);
       g.append("circle").attr("r", 4).attr("fill", item[1]);
       g.append("text").attr("x", 8).attr("y", 4).text(item[0]).attr("font-size", "10px").attr("fill", "#64748b").attr("font-weight", "500");
    });

  }, [data]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full min-h-[320px]">
      <svg ref={svgRef} className="h-full w-full overflow-visible" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded-lg bg-slate-900/95 px-3 py-2 text-xs text-white shadow-xl opacity-0 transition-opacity duration-200 backdrop-blur-sm border border-slate-800"
      />
    </div>
  );
}