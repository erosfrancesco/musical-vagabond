import React from 'react';

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
};

export function Table<T>({ columns, data, className = '', onRowClick, actions }: TableProps<T>): JSX.Element {
  return (
    <div className={`w-full overflow-auto bg-white rounded border ${className}`}>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-2 text-left text-gray-600 ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-2 text-right text-gray-600">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-6 text-center text-gray-500">
                Nessun elemento
              </td>
            </tr>
          )}

          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-t hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 align-top ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : (String((row as any)[col.key]) ?? '')}
                </td>
              ))}

              {actions && <td className="px-4 py-3 align-top text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
