/**
 * Shared utility to safely convert headers and 2D row arrays to CSV format.
 * Properly quotes all cells and escapes internal double-quotes to prevent corruption.
 */
export function tableToCsv(headers: string[], rows: (string | number)[][]): string {
  const formatCell = (cell: string | number | boolean | null | undefined): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(formatCell).join(',');
  const rowLines = rows.map(r => r.map(formatCell).join(','));
  return [headerLine, ...rowLines].join('\n');
}

/**
 * Escapes HTML characters to prevent XSS vulnerability when inserting user strings into innerHTML or document.write.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
