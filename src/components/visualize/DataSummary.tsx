import { Card } from "@/components/ui/card";
import { FileText, Database, BarChart } from "lucide-react";

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
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Total Rows</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{data.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Total Columns</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{columns.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Data Points</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{data.length * columns.length}</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Column Analysis</h3>
        <div className="grid gap-4">
          {columns.map(col => {
            const summary = getColumnSummary(String(col.id));
            return (
              <Card key={String(col.id)} className="p-4">
                <h4 className="font-medium">{col.header}</h4>
                <div className="mt-2 space-y-2 text-sm">
                  <p>Type: {summary.type}</p>
                  <p>Null values: {summary.nullCount}</p>
                  {summary.type === 'number' && (
                    <>
                      <p>Min: {summary.min?.toLocaleString()}</p>
                      <p>Max: {summary.max?.toLocaleString()}</p>
                      <p>Mean: {summary.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </>
                  )}
                  {summary.type === 'text' && summary.uniqueValues && (
                    <div>
                      <p>Unique values ({Math.min(10, summary.uniqueValues.length)} of {summary.uniqueValues.length}):</p>
                      <ul className="mt-1 list-disc list-inside">
                        {summary.uniqueValues.map((value, index) => (
                          <li key={index} className="text-muted-foreground">{value}</li>
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