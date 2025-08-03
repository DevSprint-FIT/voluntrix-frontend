import React from 'react';

export type Column<T> = {
  header: string;
  accessor: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Table<T extends Record<string, any>>({
  columns,
  data,
  handleRowClick,
}: TableProps<T> & { handleRowClick?: (row: T) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-shark-100 bg-white text-sm border-separate border-spacing-y-2">
        <thead className="bg-white">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left font-secondary text-shark-800"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => handleRowClick && handleRowClick(row)}
            >
              {columns.map((col, j) => {
                const cellValue = row[col.accessor];
                return (
                  <td
                    key={j}
                    style={{ backgroundColor: '#FBFBFB' }}
                    className="px-6 py-4 text-shark-900 font-secondary font-bold "
                  >
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
