import { Card } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { StatsSummaryCards } from "./summary/StatsSummaryCards";
import { ColumnAnalysisCard } from "./summary/ColumnAnalysisCard";

interface DataSummaryProps {
  data: any[];
  columns: ColumnDef<any>[];
}

export const DataSummary = ({ data, columns }: DataSummaryProps) => {
  const getColumnSummary = (columnId: string) => {
    // Early return for empty data
    if (!data || !data.length) {
      return {
        type: 'unknown',
        nullCount: 0,
        distribution: {}
      };
    }

    // Safely extract values and handle nulls
    const values = data.map(row => row?.[columnId]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined);
    const nullCount = values.length - nonNullValues.length;

    // Handle case with no valid values
    if (!nonNullValues.length) {
      return {
        type: 'unknown',
        nullCount,
        distribution: {}
      };
    }

    // Determine type from first non-null value
    const firstNonNullValue = nonNullValues[0];
    const type = typeof firstNonNullValue;

    // Handle numeric data
    if (type === 'number' || (!isNaN(Number(firstNonNullValue)) && firstNonNullValue !== '')) {
      const numericValues = nonNullValues
        .map(v => Number(v))
        .filter(n => !isNaN(n));

      if (!numericValues.length) {
        return {
          type: 'text',
          uniqueValues: Array.from(new Set(nonNullValues)).slice(0, 10),
          nullCount,
          distribution: getCategoryDistribution(nonNullValues)
        };
      }

      return {
        type: 'number',
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        nullCount,
        distribution: getNumericDistribution(numericValues)
      };
    }

    // Handle text data
    const uniqueValues = Array.from(new Set(nonNullValues));
    return {
      type: 'text',
      uniqueValues: uniqueValues.slice(0, 10),
      nullCount,
      distribution: getCategoryDistribution(nonNullValues)
    };
  };

  const getNumericDistribution = (values: number[]): Record<string, number> => {
    if (!values.length) return {};
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const bucketSize = range / 10;
    
    const distribution: Record<string, number> = {};
    for (let i = 0; i < 10; i++) {
      const bucketStart = min + (i * bucketSize);
      const bucketEnd = bucketStart + bucketSize;
      const label = `${bucketStart.toFixed(2)} - ${bucketEnd.toFixed(2)}`;
      distribution[label] = values.filter(v => v >= bucketStart && v < bucketEnd).length;
    }
    return distribution;
  };

  const getCategoryDistribution = (values: any[]): Record<string, number> => {
    const distribution: Record<string, number> = {};
    values.forEach(value => {
      const strValue = String(value).slice(0, 100); // Limit string length to prevent memory issues
      distribution[strValue] = (distribution[strValue] || 0) + 1;
    });
    return distribution;
  };

  return (
    <div className="space-y-6">
      <StatsSummaryCards data={data} columns={columns} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Column Analysis</h3>
        <div className="grid gap-4">
          {columns.map(col => {
            const columnId = String(col.id);
            const summary = getColumnSummary(columnId);
            return (
              <ColumnAnalysisCard
                key={columnId}
                column={col}
                data={data}
                summary={summary}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};