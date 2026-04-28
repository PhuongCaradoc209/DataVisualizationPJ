import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Table, type ColumnDef } from "../../components/ui/Table";

interface CatalogRow {
  id: string;
  title: string;
  kind: "Movie" | "TV";
  region: "NA" | "EU" | "APAC" | "LATAM";
  producer: string;
  score: number;
}

const rows: Array<CatalogRow> = [
  {
    id: "tt001",
    title: "Sample Title A",
    kind: "Movie",
    region: "NA",
    producer: "Warner Bros.",
    score: 8.2,
  },
  {
    id: "tt002",
    title: "Sample Title B",
    kind: "TV",
    region: "EU",
    producer: "BBC Studios",
    score: 7.6,
  },
  {
    id: "tt003",
    title: "Sample Title C",
    kind: "Movie",
    region: "APAC",
    producer: "Toho",
    score: 8.7,
  },
];

const columns: Array<ColumnDef<CatalogRow>> = [
  {
    id: "title",
    header: "Title",
    cell: (r) => <span className="font-medium text-slate-900">{r.title}</span>,
  },
  { id: "kind", header: "Type", cell: (r) => r.kind },
  { id: "region", header: "Region", cell: (r) => r.region },
  { id: "producer", header: "Producer", cell: (r) => r.producer },
  {
    id: "score",
    header: "Score",
    cell: (r) => (
      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
        {r.score.toFixed(1)}
      </span>
    ),
  },
];

export function DashboardPage() {
  const barHeights = [
    "h-10",
    "h-12",
    "h-14",
    "h-16",
    "h-20",
    "h-24",
    "h-28",
    "h-32",
    "h-36",
    "h-40",
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          KPI snapshots and recent catalog activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Total Titles</CardDescription>
              <CardTitle className="mt-2 text-2xl">12,450</CardTitle>
            </div>
            <div className="text-sm font-semibold text-emerald-600">+4.2%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Movies vs TV</CardDescription>
              <CardTitle className="mt-2 text-2xl">65% / 35%</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[65%] bg-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Top Producer</CardDescription>
              <CardTitle className="mt-2 text-2xl">Warner Bros.</CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              Leader
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Global Distribution</CardTitle>
              <CardDescription>
                Chart placeholder (map / geo heat)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
              Map / Geo chart placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Volume Timeline</CardTitle>
              <CardDescription>
                Chart placeholder (monthly volume)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-2 rounded-xl bg-slate-50 p-4">
              {barHeights.map((h, idx) => (
                <div
                  key={`${h}-${idx}`}
                  className={`w-full rounded-sm bg-primary/20 ${h}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Recent Catalog
          </h3>
          <p className="text-sm text-slate-500">
            Example table component for future API data.
          </p>
        </div>
        <Table columns={columns} rows={rows} getRowId={(r) => r.id} />
      </div>
    </div>
  );
}
