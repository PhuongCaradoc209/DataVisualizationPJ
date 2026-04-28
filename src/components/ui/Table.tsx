import type * as React from "react";

import { cn } from "../common/cn";

export interface ColumnDef<TData extends object> {
  id: string;
  header: string;
  className?: string;
  cell?: (row: TData) => React.ReactNode;
}

export interface TableProps<TData extends object> {
  columns: Array<ColumnDef<TData>>;
  rows: Array<TData>;
  getRowId: (row: TData) => string;
  emptyMessage?: string;
}

export function Table<TData extends object>({
  columns,
  rows,
  getRowId,
  emptyMessage = "No data found.",
}: TableProps<TData>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-900/40">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className="border-t border-slate-200 dark:border-slate-800"
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200"
                  >
                    {col.cell ? col.cell(row) : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
