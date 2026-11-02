/**
 * DataTable Component.
 * Generic reusable responsive table with headers, custom cell renderers, and empty state.
 */

import React from 'react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  width?: string;
  minWidth?: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  tableClassName?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data records found.',
  className,
  tableClassName,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.8rem', color: '#0d9488', marginBottom: '10px' }} />
        <p style={{ margin: 0, fontSize: '0.88rem' }}>Loading data records...</p>
      </div>
    );
  }

  return (
    <div className={`admin-table-responsive ${className || ''}`.trim()}>
      <table className={`admin-table ${tableClassName || ''}`.trim()}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.className}
                style={{
                  width: col.width,
                  minWidth: col.minWidth || col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                <i className="fa-solid fa-inbox" style={{ fontSize: '2rem', marginBottom: '8px', display: 'block', color: '#cbd5e1' }} />
                <span>{emptyMessage}</span>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={keyExtractor(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.className}
                    style={{
                      width: col.width,
                      minWidth: col.minWidth || col.width,
                    }}
                  >
                    {col.render ? col.render(row, idx) : (row as any)[col.key]}
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

export default DataTable;
