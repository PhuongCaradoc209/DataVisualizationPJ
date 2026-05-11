import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

export function AcquisitionScatter({ data }: { data: NetflixData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || data.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 300;
    
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const validData = data.filter(d => d.release_year && d.year_added);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3.scaleLinear()
      .domain([d3.min(validData, d => d.release_year)! - 2, d3.max(validData, d => d.release_year)! + 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([d3.min(validData, d => d.year_added)! - 1, d3.max(validData, d => d.year_added)! + 1])
      .range([height - margin.bottom, margin.top]);

    // Trục X
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .attr("color", "#94a3b8");
    
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - 10) // Cách lề dưới 10px
      .text("Release Year")
      .attr("fill", "#94a3b8")
      .attr("font-size", "12px")
      .attr("font-weight", "600");

    // Trục Y
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format("d")))
      .attr("color", "#94a3b8");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)") // Xoay chữ dọc
      .attr("y", 15) // Cách lề trái 15px
      .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 2))
      .text("Year Added")
      .attr("fill", "#94a3b8")
      .attr("font-size", "12px")
      .attr("font-weight", "600");

    // Lưới (Grid lines)
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .attr("stroke-opacity", 0.1)
      .attr("color", "#94a3b8");

    // Vẽ điểm (Dots)
    svg.append("g")
      .selectAll("circle")
      .data(validData)
      .join("circle")
      .attr("cx", d => x(d.release_year!))
      .attr("cy", d => y(d.year_added!))
      .attr("r", 4)
      .attr("fill", d => d.type === "Movie" ? "#ef4444" : "#f59e0b")
      .attr("opacity", 0.4);

  }, [data]);

  return (
    <div ref={wrapperRef} className="h-full w-full min-h-[300px]">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
}