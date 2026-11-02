/**
 * Export CSV Utility.
 * Generates and downloads standard UTF-8 CSV spreadsheet exports.
 */

export interface ExportCsvOptions {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

export function exportTableToCSV({ filename, headers, rows }: ExportCsvOptions): void {
  const escapeCell = (cell: string | number | undefined | null) => {
    if (cell === undefined || cell === null) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.endsWith('.csv') ? filename : `${filename}.csv`}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
