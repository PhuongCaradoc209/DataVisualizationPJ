import { useMemo, useState } from "react";
import { Icon } from "../../components/common/Icon";
import { Card } from "../../components/ui/Card";
import rawData from "../../data/netflix_dataset.json";
import { type NetflixData } from "../../types/NetflixData";
import { AcquisitionScatter } from "../../components/charts/AcquisitionScatter";
import { RatingRadar } from "../../components/charts/RatingRadar";

const allData = rawData as NetflixData[];

export function AnalysisPage() {
  // States cho Custom Filters
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");

  // Các tuỳ chọn filter
  const ratings = [
    "All",
    ...Array.from(
      new Set(
        allData.map((d) => d.rating).filter((r) => r && r !== "Not Specified"),
      ),
    ),
  ];

  // Xử lý dữ liệu động theo filter
  const filteredData = useMemo(() => {
    return allData.filter((d) => {
      if (selectedType !== "All" && d.type !== selectedType) return false;
      if (selectedRating !== "All" && d.rating !== selectedRating) return false;
      return true;
    });
  }, [selectedType, selectedRating]);

  // Tính toán số liệu cho Dashboard
  const stats = useMemo(() => {
    // Độ trễ trung bình (Release vs Added)
    const lags = filteredData
      .map((d) => d.year_added - (d.release_year || d.year_added))
      .filter((l) => l >= 0);
    const avgLag = lags.length
      ? (lags.reduce((a, b) => a + b, 0) / lags.length).toFixed(1)
      : "0.0";

    // Top Region
    const countries = filteredData
      .flatMap((d) => d.country || [])
      .filter((c) => c !== "Not Specified");
    let topCountryName = "N/A";
    let topCountryCount = 0;

    if (countries.length > 0) {
      const countryCounts = countries.reduce<Record<string, number>>(
        (acc, c) => {
          acc[c] = (acc[c] || 0) + 1;
          return acc;
        },
        {},
      );
      const sortedCountries = Object.entries(countryCounts).sort(
        (a, b) => b[1] - a[1],
      );
      if (sortedCountries.length > 0 && sortedCountries[0]) {
        topCountryName = sortedCountries[0][0];
        topCountryCount = sortedCountries[0][1];
      }
    }

    // Freshness (% phim chiếu cùng năm sản xuất)
    const freshCount = filteredData.filter(
      (d) => d.release_year === d.year_added,
    ).length;
    const freshPct = filteredData.length
      ? Math.round((freshCount / filteredData.length) * 100)
      : 0;

    // Peak Month
    const months = filteredData.map((d) => d.month_added).filter(Boolean);
    const monthNames = [
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
    let peakMonthName = "N/A";
    let peakMonthCount = 0;

    if (months.length > 0) {
      const monthCounts = months.reduce<Record<number, number>>((acc, m) => {
        acc[m] = (acc[m] || 0) + 1;
        return acc;
      }, {});
      const sortedMonths = Object.entries(monthCounts).sort(
        (a, b) => b[1] - a[1],
      );
      if (sortedMonths.length > 0 && sortedMonths[0]) {
        const monthIndex = Number(sortedMonths[0][0]) - 1;
        peakMonthName = monthNames[monthIndex] || "N/A";
        peakMonthCount = sortedMonths[0][1];
      }
    }

    return {
      avgLag,
      topCountry: { name: topCountryName, count: topCountryCount },
      freshPct,
      peakMonth: { name: peakMonthName, count: peakMonthCount },
    };
  }, [filteredData]);

  return (
    <div className="-m-8">
      {/* Filters Bar */}
      <div className="flex gap-3 overflow-x-auto border-b border-slate-100 bg-slate-50/50 px-8 py-4 dark:border-slate-800 dark:bg-slate-900/30">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 outline-none"
        >
          <option value="All">Type: All</option>
          <option value="Movie">Type: Movie</option>
          <option value="TV Show">Type: TV Show</option>
        </select>

        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 outline-none"
        >
          {ratings.map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "Rating: All" : r}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-background-light/30 px-8 pb-4 pt-1 dark:bg-background-dark/30">
        {" "}
        <div className="space-y-6">
          {/* Tiêu đề & Global KPI */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Catalog Analytics
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Detailed breakdown of acquisition strategies and content
                maturity
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {stats.avgLag} Yrs
              </p>
              <div className="flex items-center gap-2 text-sm md:justify-end">
                <span className="font-bold text-slate-500">
                  Average Acquisition Lag
                </span>
              </div>
            </div>
          </div>

          {/* Dòng biểu đồ chính */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Box Trái: Scatter Plot (Chiếm 3/5) */}
            <Card className="flex flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800 lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                  Acquisition Lag (Release vs Added)
                </h4>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>{" "}
                    Movie
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div> TV
                    Show
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <AcquisitionScatter data={filteredData} />
              </div>
            </Card>

            {/* Box Phải: Radar Chart (Chiếm 2/5) */}
            <Card className="flex flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800 lg:col-span-2">
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                Maturity Rating Focus
              </h4>
              <div className="flex flex-1 items-center justify-center">
                <RatingRadar data={filteredData} />
              </div>
            </Card>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  Top Origin
                </span>
                {/* Đổi từ stats.topCountry[1] thành stats.topCountry.count */}
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {stats.topCountry.count} titles
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="map" className="text-primary" />
                </div>
                <div>
                  {/* Đổi từ stats.topCountry[0] thành stats.topCountry.name */}
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {stats.topCountry.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Leading producer region
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  Peak Drop Month
                </span>
                {/* Đổi từ stats.peakMonth[1] thành stats.peakMonth.count */}
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {stats.peakMonth.count} titles added
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="schedule" className="text-primary" />
                </div>
                <div>
                  {/* Đổi từ stats.peakMonth[0] thành stats.peakMonth.name */}
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {stats.peakMonth.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Busiest month for catalog updates
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  Content Freshness
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="new_releases" className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {stats.freshPct}% Same-Year
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Released & added in the same year
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
