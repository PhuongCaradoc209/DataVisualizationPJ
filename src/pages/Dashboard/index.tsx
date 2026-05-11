import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Table, type ColumnDef } from "../../components/ui/Table";
import rawData from "../../data/netflix_dataset.json";
import { type NetflixData } from "../../types/NetflixData";
import { VolumeTimeline } from "../../components/charts/VolumeTimeline";
import { GenreTreemap } from "../../components/charts/GenreTreemap";

const allData = rawData as NetflixData[];

// ── Pre-computed constants (không phụ thuộc filter) ──────────────────────────
const ALL_YEARS = Array.from(
  new Set(allData.map((d) => d.year_added).filter(Boolean)),
).sort((a, b) => a - b);

const MIN_YEAR = ALL_YEARS[0] ?? 2008;
const MAX_YEAR = ALL_YEARS[ALL_YEARS.length - 1] ?? 2021;

const topDirectorAll = (() => {
  const counts = allData
    .map((d) => d.director ?? "")
    .filter((d) => d && d !== "Not Specified")
    .reduce<Record<string, number>>((acc, d) => {
      acc[d] = (acc[d] ?? 0) + 1;
      return acc;
    }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
})();

// ── Table columns ─────────────────────────────────────────────────────────────
const columns: Array<ColumnDef<NetflixData>> = [
  {
    id: "title",
    header: "Title",
    cell: (r) => <span className="font-medium text-slate-900">{r.title}</span>,
  },
  { id: "type", header: "Type", cell: (r) => r.type },
  {
    id: "year",
    header: "Year Added",
    cell: (r) => r.year_added?.toString() ?? "—",
  },
  { id: "rating", header: "Rating", cell: (r) => r.rating ?? "—" },
  { id: "duration", header: "Duration", cell: (r) => r.duration ?? "—" },
];

const PAGE_SIZE = 15;

export function DashboardPage() {
  // ── Filter state ────────────────────────────────────────────────────────────
  const [typeFilter, setTypeFilter] = useState<"All" | "Movie" | "TV Show">(
    "All",
  );
  const [yearRange, setYearRange] = useState<[number, number]>([
    MIN_YEAR,
    MAX_YEAR,
  ]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // ── Filtered data ───────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return allData.filter((d) => {
      if (typeFilter !== "All" && d.type !== typeFilter) return false;
      if (d.year_added < yearRange[0] || d.year_added > yearRange[1])
        return false;
      return true;
    });
  }, [typeFilter, yearRange]);

  // ── Table data (search + pagination) ───────────────────────────────────────
  const tableRows = useMemo(() => {
    const q = search.toLowerCase();
    const searched = filteredData.filter(
      (d) =>
        !q ||
        d.title.toLowerCase().includes(q) ||
        (d.director ?? "").toLowerCase().includes(q) ||
        (d.type ?? "").toLowerCase().includes(q),
    );
    // Sort newest first
    searched.sort((a, b) => {
      if (b.year_added !== a.year_added) return b.year_added - a.year_added;
      return (b.month_added ?? 0) - (a.month_added ?? 0);
    });
    return searched;
  }, [filteredData, search]);

  const totalPages = Math.ceil(tableRows.length / PAGE_SIZE);
  const pageRows = tableRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page khi filter thay đổi
  const handleTypeFilter = (t: "All" | "Movie" | "TV Show") => {
    setTypeFilter(t);
    setPage(0);
  };
  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(0);
  };
  const handleYearRange = (min: number, max: number) => {
    setYearRange([min, max]);
    setPage(0);
  };

  // ── KPI từ filteredData ─────────────────────────────────────────────────────
  const totalTitles = filteredData.length;
  const movies = filteredData.filter((d) => d.type === "Movie").length;
  const tvShows = filteredData.filter((d) => d.type === "TV Show").length;
  const moviePct =
    totalTitles > 0 ? Math.round((movies / totalTitles) * 100) : 0;
  const tvPct = 100 - moviePct;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Netflix catalog — {allData.length.toLocaleString()} total titles.
        </p>
      </div>

      {/* ── Filter Controls ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
        {/* Content Type */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Content Type
          </span>
          <div className="pt-1 flex gap-2">
            {(["All", "Movie", "TV Show"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeFilter(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  typeFilter === t
                    ? "bg-primary text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Year Range – single slider (from MIN_YEAR to selected year) */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Year Added: {yearRange[0]} – {yearRange[1]}
          </span>
          <div className="pt-3 flex items-center gap-3">
            <span className="text-xs text-slate-400">{MIN_YEAR}</span>
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearRange[1]}
              onChange={(e) =>
                handleYearRange(yearRange[0], Number(e.target.value))
              }
              className="flex-1 accent-primary"
            />
            <span className="text-xs text-slate-400">{MAX_YEAR}</span>
          </div>
        </div>

        {/* Result count */}
        <div className="flex flex-col justify-center gap-1 sm:items-end">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Results
          </span>
          <div className="text-2xl font-bold text-slate-900">
            {totalTitles.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">titles match filters</div>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Filtered Titles</CardDescription>
              <CardTitle className="mt-2 text-2xl">
                {totalTitles.toLocaleString()}
              </CardTitle>
            </div>
            <div className="text-sm text-slate-500">
              {movies.toLocaleString()} Movies — {tvShows.toLocaleString()} TV
              Shows
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardDescription>Movies vs TV Shows</CardDescription>
              <CardTitle className="mt-2 text-2xl">
                {moviePct}% / {tvPct}%
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${moviePct}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Movie</span>
              <span>TV Show</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardDescription>Top Director (all time)</CardDescription>
              <CardTitle className="mt-2 truncate text-xl">
                {topDirectorAll?.[0] ?? "—"}
              </CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              {topDirectorAll?.[1] ?? 0} titles
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* ── Charts ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Top Genres</CardTitle>
              <CardDescription>Top 15 genres in filtered set</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <GenreTreemap data={filteredData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Volume Timeline</CardTitle>
              <CardDescription>
                Titles added per year (filtered)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <VolumeTimeline data={filteredData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Catalog Table ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Catalog</h3>
            <p className="text-sm text-slate-500">
              {tableRows.length.toLocaleString()} results
            </p>
          </div>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search title, director, type…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64"
          />
        </div>

        <Table columns={columns} rows={pageRows} getRowId={(r) => r.show_id} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
