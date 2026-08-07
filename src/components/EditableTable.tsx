import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Table as TableIcon,
  BarChart3,
  Download,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { TableData, ChartType, ConfidenceLevel } from '../types';

interface EditableTableProps {
  table: TableData;
  onTableUpdate?: (updatedTable: TableData) => void;
  onJumpToPage?: (page: number) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export const EditableTable: React.FC<EditableTableProps> = ({
  table,
  onTableUpdate,
  onJumpToPage
}) => {
  const [headers, setHeaders] = useState<string[]>(table.headers || []);
  const [rows, setRows] = useState<string[][]>(table.rows || []);
  const [chartType, setChartType] = useState<ChartType>(table.selectedChartType || table.recommendedChartType || 'bar');
  const [isEditingHeaders, setIsEditingHeaders] = useState(false);

  // Convert headers and 2D row array to Recharts JSON data format
  const chartData = rows.map((row) => {
    const item: Record<string, any> = {};
    const labelKey = headers[0] || 'Category';
    item[labelKey] = row[0] || 'Item';

    for (let i = 1; i < headers.length; i++) {
      const headerName = headers[i] || `Metric ${i}`;
      const valStr = (row[i] || '0').replace(/[\$,%]/g, '');
      const valNum = parseFloat(valStr);
      item[headerName] = isNaN(valNum) ? row[i] : valNum;
    }
    return item;
  });

  const handleCellChange = (rowIndex: number, colIndex: number, newValue: string) => {
    const updatedRows = rows.map((r, ri) =>
      ri === rowIndex ? r.map((c, ci) => (ci === colIndex ? newValue : c)) : r
    );
    setRows(updatedRows);
    if (onTableUpdate) {
      onTableUpdate({ ...table, headers, rows: updatedRows, selectedChartType: chartType });
    }
  };

  const handleHeaderChange = (colIndex: number, newHeader: string) => {
    const updatedHeaders = headers.map((h, ci) => (ci === colIndex ? newHeader : h));
    setHeaders(updatedHeaders);
    if (onTableUpdate) {
      onTableUpdate({ ...table, headers: updatedHeaders, rows, selectedChartType: chartType });
    }
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill('0');
    newRow[0] = `New Row ${rows.length + 1}`;
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    const updatedRows = rows.filter((_, ri) => ri !== rowIndex);
    setRows(updatedRows);
  };

  const downloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${table.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> High Confidence
          </span>
        );
      case 'ocr_estimated':
      case 'medium':
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800" title="Extracted via OCR fallback pass. Please double-check cell values.">
            <AlertTriangle className="w-3 h-3 text-amber-500" /> OCR Estimate (Verify Cells)
          </span>
        );
      default:
        return null;
    }
  };

  const numericHeaders = headers.slice(1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
      
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {table.title}
            </h4>
            {getConfidenceBadge(table.confidence)}
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Citation:</span>
            <button
              onClick={() => onJumpToPage && onJumpToPage(table.pageNumber)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono font-medium"
            >
              {table.citation}
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart Picker */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            {(['bar', 'line', 'pie', 'stacked_bar'] as ChartType[]).map((ct) => (
              <button
                key={ct}
                onClick={() => setChartType(ct)}
                className={`px-2 py-1 rounded capitalize transition-colors ${
                  chartType === ct
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {ct.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Export Table as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Editable Table Grid */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              {headers.map((h, ci) => (
                <th key={ci} className="p-2.5 font-bold border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => handleHeaderChange(ci, e.target.value)}
                    className="bg-transparent outline-none font-bold text-slate-900 dark:text-white w-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 p-1 rounded"
                  />
                </th>
              ))}
              <th className="p-2.5 w-10 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                {row.map((cell, ci) => (
                  <td key={ci} className="p-2 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(ri, ci, e.target.value)}
                      className="bg-transparent outline-none w-full text-slate-800 dark:text-slate-200 focus:bg-indigo-50 dark:focus:bg-indigo-950/60 p-1 rounded transition-colors"
                    />
                  </td>
                ))}
                <td className="p-2 text-center">
                  <button
                    onClick={() => deleteRow(ri)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                    title="Delete Row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Row
        </button>

        <span className="text-[11px] italic">
          <Edit3 className="w-3 h-3 inline mr-1 text-indigo-500" />
          Click any cell to edit values — chart re-renders automatically.
        </span>
      </div>

      {/* Dynamic Recharts Visualization */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Visualization ({chartType.replace('_', ' ').toUpperCase()})
          </h5>
          <span className="text-[10px] text-slate-400">
            Powered by Recharts
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' || chartType === 'stacked_bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey={headers[0]} stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {numericHeaders.map((header, idx) => (
                  <Bar
                    key={header}
                    dataKey={header}
                    stackId={chartType === 'stacked_bar' ? 'a' : undefined}
                    fill={COLORS[idx % COLORS.length]}
                    radius={chartType === 'stacked_bar' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey={headers[0]} stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {numericHeaders.map((header, idx) => (
                  <Line
                    key={header}
                    type="monotone"
                    dataKey={header}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            ) : (
              <PieChart>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Pie
                  data={chartData}
                  dataKey={numericHeaders[0] || 'Value'}
                  nameKey={headers[0]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
