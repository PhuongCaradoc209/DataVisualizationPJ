import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type NetflixData } from "../../types/NetflixData";

interface Props {
  data: NetflixData[];
}

interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

export function GenreTreemap({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !data || data.length === 0)
      return;

    // 1. Tách mảng listed_in và đếm số lần xuất hiện
    const allGenres = data.flatMap((d) => d.listed_in ?? []);
    const genreCounts = d3
      .rollups(
        allGenres,
        (v) => v.length,
        (d) => d,
      )
      .sort((a, b) => d3.descending(a[1], b[1]))
      .slice(0, 15); // Top 15 genre

    // 2. Format dạng Hierarchical cho D3 Treemap
    const rootData: TreeNode = {
      name: "root",
      children: genreCounts.map(([name, value]) => ({ name, value })),
    };

    const width = wrapperRef.current.clientWidth;
    const height = 300;

    // 3. Tạo hierarchy và layout
    const root = d3
      .hierarchy<TreeNode>(rootData)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    // Lưu kết quả vào treeRoot → kiểu HierarchyRectangularNode có x0/y0/x1/y1
    const treeRoot = d3.treemap<TreeNode>().size([width, height]).padding(2)(
      root,
    );

    // 4. Render SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // 5. Color scale (đỏ đậm → nhạt theo Netflix style)
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, Math.max(genreCounts.length - 1, 1)])
      .range(["#dc2626", "#fca5a5"]);

    const tooltip = d3.select(tooltipRef.current);

    const nodes = svg
      .selectAll<SVGGElement, d3.HierarchyRectangularNode<TreeNode>>("g")
      .data(treeRoot.leaves()) // ← dùng treeRoot thay vì root
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    // 6. Vẽ hình chữ nhật
    nodes
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (_, i) => colorScale(i))
      .attr("rx", 4)
      .attr("ry", 4)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.75);
        const pct = (((d.value ?? 0) / data.length) * 100).toFixed(1);
        tooltip
          .style("opacity", "1")
          .style("left", `${(event as MouseEvent).offsetX + 12}px`)
          .style("top", `${(event as MouseEvent).offsetY - 50}px`)
          .html(
            `<div class="font-semibold mb-0.5">${d.data.name}</div>` +
              `<div>${(d.value ?? 0).toLocaleString()} titles</div>` +
              `<div class="text-slate-300">${pct}% of filtered set</div>`,
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${(event as MouseEvent).offsetX + 12}px`)
          .style("top", `${(event as MouseEvent).offsetY - 50}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", "0");
      });

    // Genre label – only show if cell is wide enough
    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 16)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => (d.x1 - d.x0 > 60 ? d.data.name : ""));

    // Count label
    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 30)
      .attr("fill", "rgba(255,255,255,0.8)")
      .attr("font-size", "10px")
      .text((d) => (d.x1 - d.x0 > 60 ? (d.value ?? 0).toLocaleString() : ""));
  }, [data]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full min-h-[300px]">
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
