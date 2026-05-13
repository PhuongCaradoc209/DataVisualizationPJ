import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/common/Icon";
import rawData from "../../data/netflix_dataset.json";
import { type NetflixData } from "../../types/NetflixData";
import { CountryBarChart } from "../../components/charts/CountryBarChart";
import { DurationChart } from "../../components/charts/DurationChart";

const allData = rawData as NetflixData[];

export function ReportsPage() {
  // Calculate hard statistics for reporting
  const stats = useMemo(() => {
    const total = allData.length;
    const movies = allData.filter((d) => d.type === "Movie");
    
    const movieDurations = movies
      .map((m) => parseInt(m.duration?.split(" ")[0] ?? "0"))
      .filter((d) => !isNaN(d) && d > 0);
    
    const avgDuration = movieDurations.length 
      ? Math.round(movieDurations.reduce((a, b) => a + b, 0) / movieDurations.length) 
      : 0;

    const allCountriesSet = new Set(
      allData.flatMap((d) => d.country || []).filter((c) => c && c !== "Not Specified")
    );

    // Extra hard info for the report
    const moviePct = total > 0 ? Math.round((movies.length / total) * 100) : 0;

    return {
      total,
      moviesCount: movies.length,
      avgDuration,
      countriesCount: allCountriesSet.size,
      moviePct
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Standard Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Analytical Reports</h2>
          <p className="mt-1 text-sm text-slate-500">
            Macro view of distribution by geography and format.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center gap-2">
            <Icon name="file_download" className="text-[18px]" /> Export JSON
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <Icon name="print" className="text-[18px]" /> Print Snapshot
          </Button>
        </div>
      </div>

      {/* Standard Card KPIs matching Dashboard Style */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Global Coverage</CardDescription>
              <CardTitle className="mt-2 text-2xl">
                {stats.countriesCount} Countries
              </CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              Origins
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardDescription>Avg Movie Length</CardDescription>
              <CardTitle className="mt-2 text-2xl">
                {stats.avgDuration} mins
              </CardTitle>
            </div>
            <div className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Normal Size
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardDescription>Dataset Volume</CardDescription>
              <CardTitle className="mt-2 text-2xl">
                {stats.total.toLocaleString()}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Informative data block (Not abstract) */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-5">
          <div className="flex items-start gap-3">
            <Icon name="info" className="text-slate-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-700">Raw Summary Assessment</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                The current snapshot evaluates {stats.total.toLocaleString()} titles. 
                Exactly {stats.moviesCount.toLocaleString()} are classified as movies ({stats.moviePct}%), 
                sourced globally across {stats.countriesCount} verified local territories.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standard Chart Layout (Standard white background Cards) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Geographic Distribution of Netflix Content</CardTitle>
              <CardDescription>
                Number of titles produced by country
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <CountryBarChart data={allData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Distribution of Movie Durations on Netflix</CardTitle>
              <CardDescription>
                Distribution of movie durations in the Netflix catalog
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <DurationChart data={allData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
