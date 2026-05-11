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

    // 1. Xử lý dữ liệu: Đếm số lượng phim theo năm
    const countsByYear = d3
      .rollups(
        data.filter((d) => d.year_added), // Lọc bỏ dữ liệu null
        (v) => v.length,
        (d) => d.year_added,
      )
      .sort((a, b) => d3.ascending(a[0], b[0])); // Sắp xếp theo năm tăng dần

    // 2. Setup kích thước tự động theo div bọc ngoài
    const width = wrapperRef.current.clientWidth;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Xóa chart cũ khi re-render

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // 3. Setup Scales
    const x = d3
      .scaleBand()
      .domain(countsByYear.map((d) => d[0].toString()))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(countsByYear, (d) => d[1]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // 4. Vẽ Axes (Trục tọa độ)
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % 2 === 0)),
      )
      .attr("color", "#94a3b8");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#94a3b8");

    const tooltip = d3.select(tooltipRef.current);

    // 5. Vẽ bars với tooltip
    svg
      .append("g")
      .selectAll("rect")
      .data(countsByYear)
      .join("rect")
      .attr("x", (d) => x(d[0].toString())!)
      .attr("width", x.bandwidth())
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", "#ef4444")
      .attr("rx", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#b91c1c");
        tooltip
          .style("opacity", "1")
          .style("left", `${(event as MouseEvent).offsetX + 12}px`)
          .style("top", `${(event as MouseEvent).offsetY - 40}px`)
          .html(
            `<span class="font-semibold">${d[0]}</span><br/>${d[1].toLocaleString()} titles`,
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${(event as MouseEvent).offsetX + 12}px`)
          .style("top", `${(event as MouseEvent).offsetY - 40}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#ef4444");
        tooltip.style("opacity", "0");
      })
      .transition()
      .duration(700)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(0) - y(d[1]));
  }, [data]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full" />
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg opacity-0 transition-opacity"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}
