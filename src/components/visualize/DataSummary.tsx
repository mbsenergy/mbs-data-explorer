import { Card } from "@/components/ui/card";
import { FileText, Database, BarChart2, Gem, Diamond, Crown } from "lucide-react";

interface ColumnSummary {
  type: string;
  uniqueValues?: string[];
  min?: number;
  max?: number;
  mean?: number;
  nullCount: number;
}

interface DataSummaryProps {
  data: any[];
  columns: any[];
}

export const DataSummary = ({ data, columns }: DataSummaryProps) => {
  const getColumnSummary = (columnName: string): ColumnSummary => {
    const values = data.map(row => row[columnName]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined);
    const nullCount = values.length - nonNullValues.length;

    // Determine column type and calculate relevant statistics
    const firstNonNullValue = nonNullValues[0];
    const type = typeof firstNonNullValue;

    if (type === 'number') {
      const numericValues = nonNullValues.map(Number);
      return {
        type: 'number',
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        nullCount
      };
    } else {
      const uniqueValues = Array.from(new Set(nonNullValues));
      return {
        type: 'text',
        uniqueValues: uniqueValues.slice(0, 10), // Limit to first 10 unique values
        nullCount
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 metallic-card bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-cyan-400" />
            <h3 className="font-medium">Total Rows</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {data.length}
          </p>
        </Card>
        <Card className="p-4 metallic-card bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center gap-2">
            <Diamond className="h-5 w-5 text-purple-400" />
            <h3 className="font-medium">Total Columns</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {columns.length}
          </p>
        </Card>
        <Card className="p-4 metallic-card bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h3 className="font-medium">Data Points</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            {data.length * columns.length}
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Column Analysis
        </h3>
        <div className="grid gap-4">
          {columns.map(col => {
            const summary = getColumnSummary(String(col.id));
            return (
              <Card key={String(col.id)} className="p-4 metallic-card bg-gradient-to-br from-slate-900 to-slate-800">
                <h4 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {col.header}
                </h4>
                <div className="mt-2 space-y-2 text-sm">
                  <p className="text-slate-300">Type: <span className="text-cyan-400">{summary.type}</span></p>
                  <p className="text-slate-300">Null values: <span className="text-purple-400">{summary.nullCount}</span></p>
                  {summary.type === 'number' && (
                    <>
                      <p className="text-slate-300">Min: <span className="text-emerald-400">{summary.min?.toLocaleString()}</span></p>
                      <p className="text-slate-300">Max: <span className="text-emerald-400">{summary.max?.toLocaleString()}</span></p>
                      <p className="text-slate-300">Mean: <span className="text-emerald-400">
                        {summary.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span></p>
                    </>
                  )}
                  {summary.type === 'text' && summary.uniqueValues && (
                    <div>
                      <p className="text-slate-300">Unique values ({Math.min(10, summary.uniqueValues.length)} of {summary.uniqueValues.length}):</p>
                      <ul className="mt-1 list-disc list-inside">
                        {summary.uniqueValues.map((value, index) => (
                          <li key={index} className="text-cyan-400">{value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};