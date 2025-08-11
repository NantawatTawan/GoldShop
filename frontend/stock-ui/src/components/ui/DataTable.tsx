import React from "react";

interface Column<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  striped?: boolean;
  onRowClick?: (item: T, index: number) => void;
}

export default function DataTable<T>({
  data,
  columns,
  emptyMessage = "ไม่มีข้อมูล",
  striped = false,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-yellow-100 text-gray-700 font-bold">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-2 text-left ${col.className ?? ""}`.trim()}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-gray-400 py-4"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item, index)}
                className={`transition-all hover:bg-yellow-50 ${
                  striped && index % 2 === 1 ? "bg-gray-50" : ""
                } ${onRowClick ? "cursor-pointer" : ""}`.trim()}
              >
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-2 border-t">
                    {col.render(item, index)}
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
