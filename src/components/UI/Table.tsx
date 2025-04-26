import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[]; 
  data: T[];
};

export default function Table<T extends Record<string, any>>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 text-left font-medium text-gray-600">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col, j) => {
                const cellValue = row[col.accessor];
                return (
                  <td key={j} className="px-6 py-4 text-gray-800">
                    {col.cell ? col.cell(cellValue, row) : String(cellValue)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
