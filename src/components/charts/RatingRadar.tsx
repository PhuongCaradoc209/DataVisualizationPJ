import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

export function RatingRadar({ data }: { data: NetflixData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || data.length === 0) return;

    // Đếm số lượng theo Rating và lấy top 5
    const ratingCounts = d3.rollups(
      data.filter(d => d.rating && d.rating !== "Not Specified"),
      v => v.length,
      d => d.rating
    ).sort((a, b) => d3.descending(a[1], b[1])).slice(0, 5);

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight || 300;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const angleScale = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .domain(ratingCounts.map(d => d[0]!));

    const maxCount = d3.max(ratingCounts, d => d[1]) || 1;
    const radiusScale = d3.scaleLinear().range([0, radius]).domain([0, maxCount]);

    // Vẽ đa giác nền
    const ticks = [0.25, 0.5, 0.75, 1];
    ticks.forEach(t => {
      g.append("circle")
        .attr("r", radius * t)
        .style("fill", "none")
        .style("stroke", "#d2d5d8")
        .style("stroke-dasharray", "3,3");
    });

    // Vẽ đường line của data
    const line = d3.lineRadial<any>()
      .angle(d => angleScale(d[0])! + angleScale.bandwidth() / 2)
      .radius(d => radiusScale(d[1]));

    g.append("path")
      .datum(ratingCounts)
      .attr("d", d => line(d) + "Z")
      .style("fill", "rgba(239, 68, 68, 0.3)") // Đỏ Netflix nhạt
      .style("stroke", "#ef4444")
      .style("stroke-width", 2);

    // Vẽ điểm và Nhãn
    ratingCounts.forEach(d => {
      const angle = angleScale(d[0]!)! + angleScale.bandwidth() / 2 - Math.PI / 2;
      const x = Math.cos(angle) * (radius + 15);
      const y = Math.sin(angle) * (radius + 15);

      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(d[0] ?? "") // Ensure no undefined is passed
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "#64748b");

      g.append("circle")
        .attr("cx", Math.cos(angle) * radiusScale(d[1]))
        .attr("cy", Math.sin(angle) * radiusScale(d[1]))
        .attr("r", 4)
        .style("fill", "#ef4444");
    });

  }, [data]);

  return (
    <div ref={wrapperRef} className="flex h-full w-full flex-1 items-center justify-center min-h-75">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
}