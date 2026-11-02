/**
 * Export PDF Utility.
 * Generates an official BuyBright printable document configured for 'Save as PDF'.
 */

export interface ExportPdfOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
}

export function exportTableToPDF({ title, subtitle, headers, rows }: ExportPdfOptions): void {
  const printWindow = window.open('', '_blank', 'width=980,height=720');
  if (!printWindow) {
    alert('Please allow popups to export the PDF document.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${title} - BuyBright Portal</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header-banner {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0d9488;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.4px;
          }
          .brand-title span {
            font-size: 13px;
            font-weight: 800;
            color: #0d9488;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-left: 8px;
          }
          .doc-title {
            margin: 6px 0 2px 0;
            font-size: 17px;
            font-weight: 700;
            color: #334155;
          }
          .doc-subtitle {
            margin: 0;
            font-size: 12px;
            color: #64748b;
          }
          .meta-info {
            text-align: right;
            font-size: 12px;
            color: #64748b;
            line-height: 1.5;
          }
          .meta-info strong {
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 10px;
          }
          thead th {
            background-color: #f1f5f9;
            color: #334155;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 9px 12px;
            border-top: 1px solid #cbd5e1;
            border-bottom: 2px solid #cbd5e1;
            text-align: left;
          }
          tbody td {
            padding: 8px 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: middle;
          }
          tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .footer-strip {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header-banner">
          <div>
            <div class="brand-title">BuyBright <span>Admin Portal</span></div>
            <div class="doc-title">${title}</div>
            ${subtitle ? `<div class="doc-subtitle">${subtitle}</div>` : ''}
          </div>
          <div class="meta-info">
            <div><strong>Generated:</strong> ${currentDate}</div>
            <div><strong>Total Records:</strong> ${rows.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${
              rows.length === 0
                ? `<tr><td colspan="${headers.length}" style="text-align:center; padding: 24px; color: #94a3b8;">No records to display.</td></tr>`
                : rows
                    .map(
                      (row) => `
                <tr>
                  ${row.map((cell) => `<td>${cell !== undefined && cell !== null ? cell : ''}</td>`).join('')}
                </tr>
              `
                    )
                    .join('')
            }
          </tbody>
        </table>

        <div class="footer-strip">
          <span>BuyBright Administrator Export System</span>
          <span>Confidential &bull; Page 1</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
