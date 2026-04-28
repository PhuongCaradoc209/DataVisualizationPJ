import { Icon } from "../../components/common/Icon";
import { Card } from "../../components/ui/Card";

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      {label}
      <Icon name="expand_more" className="text-sm" />
    </button>
  );
}

function clipPolygon(value: string) {
  return `[clip-path:${value}]`;
}

export function AnalysisPage() {
  return (
    <div className="-m-8">
      <div className="flex gap-3 overflow-x-auto border-b border-slate-100 bg-slate-50/50 px-8 py-4 dark:border-slate-800 dark:bg-slate-900/30">
        <FilterChip label="Year: 2023" />
        <FilterChip label="Genre: All" />
        <FilterChip label="Region: Global" />
        <FilterChip label="Rating: 4+" />
      </div>

      <div className="bg-background-light/30 p-8 dark:bg-background-dark/30">
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Market Share Distribution
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Detailed breakdown of global box office by genre and region
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                $12.4B
              </p>
              <div className="flex items-center gap-2 text-sm md:justify-end">
                <span className="font-bold text-emerald-600">+8.2%</span>
                <span className="text-slate-400">vs last year</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="flex flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-400">
                Genre Dominance Treemap
              </h4>

              <div className="grid flex-1 grid-cols-4 grid-rows-4 gap-2">
                <button
                  type="button"
                  className="col-span-2 row-span-3 flex cursor-pointer flex-col justify-end rounded-xl bg-gradient-to-br from-primary to-primary/80 p-4 text-left text-white transition-all hover:brightness-110"
                >
                  <span className="text-lg font-bold">Action</span>
                  <span className="text-sm opacity-80">$4.2B (34%)</span>
                </button>

                <button
                  type="button"
                  className="col-span-2 row-span-2 flex cursor-pointer flex-col justify-end rounded-xl bg-gradient-to-br from-primary/70 to-primary/50 p-4 text-left text-white transition-all hover:brightness-110"
                >
                  <span className="text-lg font-bold">Sci-Fi</span>
                  <span className="text-sm opacity-80">$2.8B (22%)</span>
                </button>

                <button
                  type="button"
                  className="col-span-1 row-span-1 flex cursor-pointer flex-col justify-end rounded-xl bg-primary/40 p-3 text-left text-slate-800 transition-all hover:brightness-110 dark:text-slate-100"
                >
                  <span className="text-xs font-bold">Drama</span>
                  <span className="text-[10px]">$1.2B</span>
                </button>

                <button
                  type="button"
                  className="col-span-1 row-span-1 flex cursor-pointer flex-col justify-end rounded-xl bg-primary/30 p-3 text-left text-slate-800 transition-all hover:brightness-110 dark:text-slate-100"
                >
                  <span className="text-xs font-bold">Comedy</span>
                  <span className="text-[10px]">$0.9B</span>
                </button>

                <button
                  type="button"
                  className="col-span-1 row-span-1 flex cursor-pointer flex-col justify-end rounded-xl bg-primary/20 p-3 text-left text-slate-800 transition-all hover:brightness-110 dark:text-slate-100"
                >
                  <span className="text-xs font-bold">Horror</span>
                  <span className="text-[10px]">$0.6B</span>
                </button>

                <button
                  type="button"
                  className="col-span-1 row-span-1 flex cursor-pointer flex-col justify-end rounded-xl bg-primary/10 p-3 text-left text-slate-800 transition-all hover:brightness-110 dark:text-slate-100"
                >
                  <span className="text-xs font-bold">Animation</span>
                  <span className="text-[10px]">$0.5B</span>
                </button>

                <button
                  type="button"
                  className="col-span-2 row-span-1 flex cursor-pointer flex-col justify-end rounded-xl bg-primary/5 p-3 text-left text-slate-800 transition-all hover:brightness-110 dark:text-slate-100"
                >
                  <span className="text-xs font-bold">Others</span>
                  <span className="text-[10px]">$2.2B</span>
                </button>
              </div>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="flex flex-1 flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Trending Streams
                </h4>

                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className={
                        "h-full w-full bg-gradient-to-r from-primary via-primary/50 to-primary/80 " +
                        clipPolygon(
                          "polygon(0% 50%, 10% 40%, 20% 60%, 30% 30%, 40% 70%, 50% 40%, 60% 80%, 70% 20%, 80% 60%, 90% 40%, 100% 50%, 100% 100%, 0% 100%)",
                        )
                      }
                    />
                    <div
                      className={
                        "h-full w-full bg-gradient-to-r from-red-600 to-primary/40 [-mt-[10%]] " +
                        clipPolygon(
                          "polygon(0% 60%, 10% 50%, 20% 70%, 30% 40%, 40% 80%, 50% 50%, 60% 90%, 70% 30%, 80% 70%, 90% 50%, 100% 60%, 100% 100%, 0% 100%)",
                        )
                      }
                    />
                  </div>
                  <span className="relative text-xs font-medium text-slate-400">
                    Monthly Genre Revenue Stream
                  </span>
                </div>
              </Card>

              <Card className="flex flex-1 flex-col rounded-2xl border-slate-100 p-6 shadow-sm dark:border-slate-800">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Quality Performance Index
                </h4>

                <div className="flex flex-1 items-center justify-center">
                  <div className="relative h-40 w-40">
                    <div
                      className={
                        "absolute inset-0 rotate-30 border border-slate-100 dark:border-slate-800 " +
                        clipPolygon(
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        )
                      }
                    />
                    <div
                      className={
                        "absolute inset-2 rotate-30 border border-slate-100 dark:border-slate-800 " +
                        clipPolygon(
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        )
                      }
                    />
                    <div
                      className={
                        "absolute inset-4 rotate-30 border border-slate-100 dark:border-slate-800 " +
                        clipPolygon(
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        )
                      }
                    />

                    <div
                      className={
                        "absolute inset-2 rotate-30 bg-primary/20 " +
                        clipPolygon(
                          "polygon(50% 10%, 90% 35%, 80% 75%, 40% 90%, 15% 65%, 20% 30%)",
                        )
                      }
                    />

                    <div className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                  </div>

                  <div className="ml-8 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Visuals
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary/60" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Plot
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary/40" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Cast
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Top Region
                </span>
                <span className="text-xs font-bold text-emerald-500">+12%</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="map" className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    North America
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    $5.1B Gross Revenue
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Peak Hour
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Stable
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="schedule" className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    20:00 - 22:00
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    45% High Occupancy
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-100 p-5 shadow-sm dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Platform Split
                </span>
                <span className="text-xs font-bold text-primary">-2%</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <Icon name="devices" className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Streaming (62%)
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    vs Theatrical (38%)
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
