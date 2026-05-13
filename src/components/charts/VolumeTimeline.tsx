import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

interface Props {
  data: NetflixData[];
}

export function VolumeTimeline({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !data || data.length === 0)
      return;

    const countsByYear = d3
      .rollups(
        data.filter((d) => d.year_added),
        (v) => v.length,
        (d) => d.year_added,
      )
      .sort((a, b) => d3.ascending(a[0], b[0]));

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 250;
    const margin = { top: 20, right: 20, bottom: 45, left: 55 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3
      .scaleBand()
      .domain(countsByYear.map((d) => d[0].toString()))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(countsByYear, (d) => d[1]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % 2 === 0)))
      .attr("color", "#94a3b8");

    // X Axis Title
    svg.append("text")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .text("Year Added to Netflix");

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#94a3b8")
      .call(g => g.select(".domain").remove());

    // Y Axis Title
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .text("Number of Titles Added");

    const tooltip = d3.select(tooltipRef.current);

    // Grid lines
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.3)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .call(g => g.select(".domain").remove());

    // Bars
    svg.append("g")
      .selectAll("rect")
      .data(countsByYear)
      .join("rect")
      .attr("x", (d) => x(d[0].toString())!)
      .attr("width", x.bandwidth())
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", "#e60a15") // Strict visual branding compliance
      .attr("rx", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#b91c1c");
        tooltip
          .style("opacity", "1")
          .style("left", `${(event as MouseEvent).offsetX + 12}px`)
          .style("top", `${(event as MouseEvent).offsetY - 40}px`)
          .html(
            `<div class="font-semibold text-slate-300">Year ${d[0]}</div>
             <div class="text-white text-sm font-bold mt-0.5">${d[1].toLocaleString()} Titles Addded</div>`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${(event as MouseEvent).offsetX + 12}px`)
          .style("top", `${(event as MouseEvent).offsetY - 40}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#e60a15");
        tooltip.style("opacity", "0");
      })
      .transition()
      .duration(800)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(0) - y(d[1]));
  }, [data]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full min-h-[250px]">
      <svg ref={svgRef} className="h-full w-full overflow-visible" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded bg-slate-900 px-3 py-2 text-xs text-white shadow-lg opacity-0 transition-opacity border border-slate-800"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}
