import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Table, type ColumnDef } from "../../components/ui/Table";

interface ReportRow {
  id: string;
  name: string;
  owner: string;
  updatedAt: string;
  status: "Draft" | "Published";
}

const rows: Array<ReportRow> = [
  {
    id: "rpt_01",
    name: "Weekly Market Summary",
    owner: "Analytics Team",
    updatedAt: "2026-04-20",
    status: "Published",
  },
  {
    id: "rpt_02",
    name: "Catalog Health Check",
    owner: "Ops",
    updatedAt: "2026-04-18",
    status: "Draft",
  },
];

const columns: Array<ColumnDef<ReportRow>> = [
  {
    id: "name",
    header: "Report",
    cell: (r) => <span className="font-medium text-slate-900">{r.name}</span>,
  },
  { id: "owner", header: "Owner", cell: (r) => r.owner },
  { id: "updatedAt", header: "Updated", cell: (r) => r.updatedAt },
  {
    id: "status",
    header: "Status",
    cell: (r) => (
      <span
        className={
          r.status === "Published"
            ? "rounded-full bg-emerald-600/10 px-2 py-1 text-xs font-semibold text-emerald-700"
            : "rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary"
        }
      >
        {r.status}
      </span>
    ),
  },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Reports</h2>
        <p className="mt-1 text-sm text-slate-500">
          Saved outputs and scheduled exports.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Find reports</CardTitle>
            <CardDescription>Filter locally (placeholder UI)</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Search by name..."
              aria-label="Search reports"
            />
            <Input placeholder="Owner..." aria-label="Filter by owner" />
            <Button variant="primary" className="w-full md:w-auto">
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">All reports</h3>
        <Table columns={columns} rows={rows} getRowId={(r) => r.id} />
      </div>
    </div>
  );
}
