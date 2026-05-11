import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Table, type ColumnDef } from "../../components/ui/Table";
import { Icon } from "../../components/common/Icon";
import rawData from "../../data/netflix_dataset.json";
import { type NetflixData } from "../../types/NetflixData";
import { CastBubbleChart } from "../../components/charts/CastBubbleChart";
import * as d3 from "d3";

const allData = rawData as NetflixData[];

// Dynamically find Top 5 countries to allow selective filtering of superstars
const TOP_REGIONS = (() => {
  const allC = allData.flatMap(d => d.country || []).filter(c => c && c !== "Not Specified");
  const rollup = d3.rollup(allC, v => v.length, d => d);
  return Array.from(rollup).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);
})();

interface DirectorSummary {
  id: string;
  rank: number;
  name: string;
  titles: number;
  commonGenre: string;
}

const columns: Array<ColumnDef<DirectorSummary>> = [
  {
    id: "rank",
    header: "#",
    cell: (r) => <span className="text-slate-400 font-medium">{r.rank}</span>,
  },
  {
    id: "name",
    header: "Director Name",
    cell: (r) => <span className="font-semibold text-slate-900">{r.name}</span>,
  },
  {
    id: "titles",
    header: "Total Works",
    cell: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${(r.titles / 25) * 100}%` }} // Max approx 25 titles for visual scaling
          />
        </div>
        <span className="font-medium text-sm">{r.titles}</span>
      </div>
    ),
  },
  {
    id: "genre",
    header: "Primary Domain",
    cell: (r) => (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {r.commonGenre}
      </span>
    ),
  },
];

export function TalentPage() {
  // ── Dynamic Local Filters ─────────────────────────────────────────────────
  const [typeFilter, setTypeFilter] = useState<"All" | "Movie" | "TV Show">("All");
  const [regionFilter, setRegionFilter] = useState<string>("All");

  // ── Re-computing source data on the fly ───────────────────────────────────
  const filteredData = useMemo(() => {
    return allData.filter(d => {
      if (typeFilter !== "All" && d.type !== typeFilter) return false;
      if (regionFilter !== "All") {
        const match = d.country?.includes(regionFilter);
        if (!match) return false;
      }
      return true;
    });
  }, [typeFilter, regionFilter]);

  const analysis = useMemo(() => {
    // 1. Calculate Top Directors statistics from filtered set
    const directors = filteredData
      .filter(d => d.director && d.director !== "Not Specified");
    
    const dirMap = d3.group(directors, d => d.director!);
    const topDirectors = Array.from(dirMap, ([name, list]) => {
      const genres = list.flatMap(t => t.listed_in || []);
      const topGenre = d3.rollup(genres, v => v.length, g => g);
      const primaryGenre = Array.from(topGenre).sort((a, b) => b[1] - a[1])[0]?.[0] || "Various";

      return {
        id: name,
        name,
        titles: list.length,
        commonGenre: primaryGenre
      };
    })
    .sort((a, b) => b.titles - a.titles)
    .slice(0, 8)
    .map((item, idx) => ({ ...item, rank: idx + 1 })); 

    // 2. Find overall Top Cast member for the banner
    const allCast = filteredData.flatMap(d => d.cast || []).filter(c => c && c !== "Not Specified");
    const castCount = d3.rollup(allCast, v => v.length, c => c);
    const sortedCast = Array.from(castCount).sort((a, b) => b[1] - a[1]);
    const topCast = sortedCast[0];

    return {
      topDirectors,
      topCastName: topCast?.[0] || "No distinct lead found",
      topCastTitles: topCast?.[1] || 0
    };
  }, [filteredData]);

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Talent & Production Power</h2>
          <p className="mt-1 text-sm text-slate-500">
            Visual mapping of prominent stars and prolific directors.
          </p>
        </div>
      </div>

      {/* ── NEW Dynamic Filter Bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm items-center justify-between">
        <div className="flex flex-wrap gap-6">
          {/* Type Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Format</label>
            <div className="flex p-1 bg-slate-100 rounded-lg gap-1">
              {(["All", "Movie", "TV Show"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    typeFilter === type 
                      ? "bg-white shadow text-primary" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Regional Focus */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Geographic Hub</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg block w-44 p-2 focus:ring-primary focus:border-primary outline-none font-medium cursor-pointer"
            >
              <option value="All">Global Catalog</option>
              {TOP_REGIONS.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right">
           <div className="text-xl font-bold text-slate-800">{filteredData.length.toLocaleString()}</div>
           <div className="text-[10px] text-slate-400 font-bold uppercase">Analyzed Units</div>
        </div>
      </div>

      {/* Direct Div Banner */}
      <div className="bg-primary rounded-xl text-white shadow-md overflow-hidden relative z-0 transition-all duration-300 transform hover:scale-[1.01]">
        <div className="absolute top-[-20px] right-[-20px] text-[120px] text-white/10 select-none pointer-events-none z-[-1]">
          <Icon name="stars" className="text-[inherit]" />
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="bg-white/20 rounded-full p-3 shrink-0 backdrop-blur-sm self-start mt-1">
            <Icon name="workspace_premium" className="text-3xl text-white" />
          </div>
          <div className="text-center sm:text-left w-full">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Top Performer in Filtered Data</p>
            <h3 className="text-3xl font-bold mt-1 truncate max-w-full text-white">{analysis.topCastName}</h3>
            <p className="mt-2 text-sm text-white opacity-90 font-medium leading-relaxed">
              Appears in <strong className="bg-white/20 px-2 py-0.5 rounded text-white font-bold">{analysis.topCastTitles}</strong> analyzed assets
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Section: Legend optimized to top right inside Header to maximize data view area */}
        <Card className="lg:col-span-3 h-full flex flex-col">
          <CardHeader className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1">
              <CardTitle>Star Power Cluster</CardTitle>
              <CardDescription>
                Relative role frequency distribution by filter
              </CardDescription>
            </div>
            {/* Relocated legend */}
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400"></div>
                <span><strong className="text-slate-700">Size:</strong> Roles</span>
              </div>
              <div className="w-px h-3 bg-slate-200"></div>
              <div className="flex items-center gap-1">
                <div className="flex h-2 w-6 rounded-sm overflow-hidden border border-slate-300">
                   <div className="w-1/2 h-full bg-[#cbd5e1]"></div>
                   <div className="w-1/2 h-full bg-[#e60a15]"></div>
                </div>
                <span><strong className="text-slate-700">Contrast:</strong> Top Tier</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 bg-slate-50/30 relative overflow-hidden min-h-[450px]">
            {/* IMPORTANT: Key is injected here to force RE-RENDER on dataset change for physical resimulation */}
            <CastBubbleChart key={`${typeFilter}-${regionFilter}`} data={filteredData} />
          </CardContent>
        </Card>

        {/* Right Section */}
        <Card className="lg:col-span-2 h-full">
          <CardHeader className="pb-3">
            <div>
              <CardTitle>Production Drivers</CardTitle>
              <CardDescription>
                Top directors ranked by filtering subset
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-1">
            {analysis.topDirectors.length > 0 ? (
              <Table 
                columns={columns} 
                rows={analysis.topDirectors} 
                getRowId={(r) => r.id}
              />
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">No data fits combination.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

