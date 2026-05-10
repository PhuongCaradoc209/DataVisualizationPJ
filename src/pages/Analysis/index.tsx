import { useState, useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Icon } from "../../components/common/Icon";
import { Card } from "../../components/ui/Card";
import rawData from "../../data/netflix_dataset.json";
import { type NetflixData } from "../../types/NetflixData";

const allData = rawData as NetflixData[];

// ── Pre-computed year list ────────────────────────────────────────────────────
const ALL_YEARS = Array.from(
  new Set(allData.map((d) => d.year_added).filter(Boolean)),
).sort((a, b) => a - b);

// ── FilterChip ────────────────────────────────────────────────────────────────
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-4 py-1.5 text-sm font-medium transition-all ${
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      }`}
    >
      {label}
      <Icon name="expand_more" className="text-sm" />
    </button>
  );
}

// ── Monthly bar chart (Trending Streams) ──────────────────────────────────────
function MonthlyBarChart({
  data,
  year,
}: {
  data: NetflixData[];
  year: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;
    const byYear = data.filter((d) => d.year_added === year);
    const monthly = d3
      .rollups(
        byYear.filter((d) => d.month_added),
        (v) => v.length,
        (d) => d.month_added,
      )
      .sort((a, b) => a[0] - b[0]);

    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const width = wrapperRef.current.clientWidth;
    const height = 120;
    const margin = { top: 10, right: 10, bottom: 24, left: 32 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3
      .scaleBand()
      .domain(monthly.map((d) => d[0].toString()))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(monthly, (d) => d[1]) ?? 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d) => MONTHS[Number(d) - 1] ?? d))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "9px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "9px");

    const tooltip = d3.select(tooltipRef.current);

    svg
      .append("g")
      .selectAll("rect")
      .data(monthly)
      .join("rect")
      .attr("x", (d) => x(d[0].toString())!)
      .attr("width", x.bandwidth())
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", "#ef4444")
      .attr("rx", 3)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#b91c1c");
        tooltip
          .style("opacity", "1")
          .style("left", `${(event as MouseEvent).offsetX + 8}px`)
          .style("top", `${(event as MouseEvent).offsetY - 36}px`)
          .html(`<b>${MONTHS[d[0] - 1]}</b>: ${d[1]} titles`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${(event as MouseEvent).offsetX + 8}px`)
          .style("top", `${(event as MouseEvent).offsetY - 36}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#ef4444");
        tooltip.style("opacity", "0");
      })
      .transition()
      .duration(600)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(0) - y(d[1]));
  }, [data, year]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function AnalysisPage() {
  const latestYear = ALL_YEARS[ALL_YEARS.length - 1] ?? 2021;
  const [selectedYear, setSelectedYear] = useState(latestYear);
  const [typeFilter, setTypeFilter] = useState<"All" | "Movie" | "TV Show">(
    "All",
  );
  const [yearPickerOpen, setYearPickerOpen] = useState(false);

  const filtered = useMemo(() => {
    return allData.filter(
      (d) =>
        (typeFilter === "All" || d.type === typeFilter) &&
        d.year_added <= selectedYear,
    );
  }, [selectedYear, typeFilter]);

  // ── Genre counts ─────────────────────────────────────────────────────────
  const genreCounts = useMemo(() => {
    const all = filtered.flatMap((d) => d.listed_in ?? []);
    return d3
      .rollups(
        all,
        (v) => v.length,
        (d) => d,
      )
      .sort((a, b) => d3.descending(a[1], b[1]))
      .slice(0, 7);
  }, [filtered]);

  const totalGenreCount = genreCounts.reduce((s, g) => s + g[1], 0);

  const OPACITIES = [
    "from-primary to-primary/80",
    "from-primary/70 to-primary/50",
    "bg-primary/40",
    "bg-primary/30",
    "bg-primary/20",
    "bg-primary/10",
    "bg-primary/5",
  ];

  // ── Top country ──────────────────────────────────────────────────────────
  const topCountry = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((d) => {
      const c = Array.isArray(d.country) ? d.country : [];
      c.forEach((co) => {
        counts[co] = (counts[co] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .filter(([c]) => c && c !== "Not Specified")
      .sort((a, b) => b[1] - a[1])[0];
  }, [filtered]);

  // ── Movie vs TV ──────────────────────────────────────────────────────────
  const movies = filtered.filter((d) => d.type === "Movie").length;
  const tvShows = filtered.filter((d) => d.type === "TV Show").length;
  const total = filtered.length;
  const moviePct = total > 0 ? Math.round((movies / total) * 100) : 0;

  // ── Top rating ───────────────────────────────────────────────────────────
  const topRating = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((d) => {
      if (d.rating) counts[d.rating] = (counts[d.rating] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  }, [filtered]);

  return (
    <div className="-m-8">
      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 overflow-x-auto border-b border-slate-100 bg-slate-50/50 px-8 py-4 dark:border-slate-800 dark:bg-slate-900/30">
        {/* Year picker */}
        <div className="relative">
          <FilterChip
            label={`Year: up to ${selectedYear}`}
            active={yearPickerOpen}
            onClick={() => setYearPickerOpen((o) => !o)}
          />
          {yearPickerOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {[...ALL_YEARS].reverse().map((y) => (
                <button
                  key={y}
                  className={`block w-full px-5 py-2 text-left text-sm hover:bg-primary/10 ${
                    y === selectedYear
                      ? "font-bold text-primary"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                  onClick={() => {
                    setSelectedYear(y);
                    setYearPickerOpen(false);
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type filter */}
        {(["All", "Movie", "TV Show"] as const).map((t) => (
          <FilterChip
            key={t}
            label={t === "All" ? "Type: All" : t}
            active={typeFilter === t}
            onClick={() => setTypeFilter(t)}
          />
        ))}

        <span className="ml-auto self-center text-sm text-slate-400">
          <span className="font-semibold text-slate-700">
            {total.toLocaleString()}
          </span>{" "}
          titles
        </span>
      </div>

      <div className="bg-background-light/30 p-8 dark:bg-background-dark/30">
        <div className="space-y-6">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Netflix Catalog Analysis
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Genre breakdown, monthly trends, and catalog statistics up to{" "}
                {selectedYear}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {total.toLocaleString()}
              </p>
              <p className="text-sm text-slate-400">titles in filtered set</p>
            </div>
          </div>

          {/* ── Main 2-col grid ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-6">
            {/* Genre Treemap */}
            <Card className="flex flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-400">
                Genre Dominance
              </h4>
              <div className="grid flex-1 grid-cols-4 grid-rows-4 gap-2">
                {genreCounts.map(([name, count], i) => {
                  const pct = Math.round((count / totalGenreCount) * 100);
                  const colSpan =
                    i === 0
                      ? "col-span-2 row-span-3"
                      : i === 1
                        ? "col-span-2 row-span-2"
                        : i >= 6
                          ? "col-span-2 row-span-1"
                          : "col-span-1 row-span-1";
                  const bg =
                    i <= 1
                      ? `bg-gradient-to-br ${OPACITIES[i]}`
                      : (OPACITIES[i] ?? "bg-primary/5");
                  const textColor =
                    i <= 1
                      ? "text-white"
                      : "text-slate-800 dark:text-slate-100";
                  return (
                    <button
                      key={name}
                      type="button"
                      title={`${name}: ${count} titles (${pct}%)`}
                      className={`${colSpan} flex cursor-pointer flex-col justify-end rounded-xl ${bg} ${i <= 1 ? "p-4" : "p-3"} text-left ${textColor} transition-all hover:brightness-110`}
                    >
                      <span
                        className={`${i <= 1 ? "text-base" : "text-xs"} font-bold`}
                      >
                        {name}
                      </span>
                      <span
                        className={`${i <= 1 ? "text-sm opacity-80" : "text-[10px]"}`}
                      >
                        {count.toLocaleString()} ({pct}%)
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              {/* Monthly Trends */}
              <Card className="flex flex-1 flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Titles Added Monthly in {selectedYear}
                </h4>
                <MonthlyBarChart data={allData} year={selectedYear} />
              </Card>

              {/* Movie vs TV Ratio */}
              <Card className="flex flex-1 flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Content Type Split
                </h4>
                <div className="flex flex-1 items-center gap-8">
                  {/* Donut-style progress rings */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-2xl font-bold text-primary">
                      {moviePct}%
                    </div>
                    <div className="text-xs text-slate-400">Movies</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>Movie</span>
                        <span>{movies.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${moviePct}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>TV Show</span>
                        <span>{tvShows.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary/40 transition-all"
                          style={{ width: `${100 - moviePct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ── Stat Cards ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Top Country */}
            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Top Country
                </span>
                <span className="text-xs font-bold text-emerald-500">
                  {topCountry?.[1]?.toLocaleString() ?? "—"} titles
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="map" className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {topCountry?.[0] ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {topCountry
                      ? `${Math.round((topCountry[1] / total) * 100)}% of catalog`
                      : ""}
                  </p>
                </div>
              </div>
            </Card>

            {/* Top Genre */}
            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Top Genre
                </span>
                <span className="text-xs font-bold text-primary">
                  {genreCounts[0]?.[1]?.toLocaleString() ?? "—"} titles
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="category" className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {genreCounts[0]?.[0] ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {genreCounts[0]
                      ? `${Math.round((genreCounts[0][1] / totalGenreCount) * 100)}% of genres`
                      : ""}
                  </p>
                </div>
              </div>
            </Card>

            {/* Top Rating */}
            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Top Rating
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Most common
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="verified" className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {topRating?.[0] ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {topRating?.[1]?.toLocaleString() ?? "—"} titles
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
