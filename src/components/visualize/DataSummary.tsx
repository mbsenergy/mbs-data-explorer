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
    // Validate inputs
    if (!data || !Array.isArray(data) || !data.length || !columnId) {
      return {
        type: 'unknown',
        nullCount: 0,
        distribution: {}
      };
    }

    try {
      // Safely extract values and handle nulls
      const values = data.map(row => {
        if (!row || typeof row !== 'object') return null;
        return row[columnId];
      });

      const nonNullValues = values.filter(v => v !== null && v !== undefined);
      const nullCount = values.length - nonNullValues.length;

      // Handle empty data case
      if (!nonNullValues.length) {
        return {
          type: 'unknown',
          nullCount,
          distribution: {}
        };
      }

      // Determine type from first non-null value
      const firstNonNullValue = nonNullValues[0];
      
      // Check if value can be converted to a number
      const isNumeric = !isNaN(Number(firstNonNullValue)) && 
                       firstNonNullValue !== '' && 
                       firstNonNullValue !== null &&
                       firstNonNullValue !== true &&
                       firstNonNullValue !== false;

      if (isNumeric) {
        // Convert values to numbers and filter out any invalid conversions
        const numericValues = nonNullValues
          .map(v => Number(v))
          .filter(n => !isNaN(n) && isFinite(n));

        if (!numericValues.length) {
          // Fallback to text if no valid numeric values
          return {
            type: 'text',
            uniqueValues: Array.from(new Set(nonNullValues))
              .slice(0, 10)
              .map(v => String(v)),
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

      // Handle as text data
      const uniqueValues = Array.from(new Set(nonNullValues))
        .slice(0, 10)
        .map(v => String(v));

      return {
        type: 'text',
        uniqueValues,
        nullCount,
        distribution: getCategoryDistribution(nonNullValues)
      };
    } catch (error) {
      console.error('Error in getColumnSummary:', error);
      return {
        type: 'unknown',
        nullCount: 0,
        distribution: {}
      };
    }
  };

  const getNumericDistribution = (values: number[]): Record<string, number> => {
    if (!values.length) return {};
    
    try {
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
    } catch (error) {
      console.error('Error in getNumericDistribution:', error);
      return {};
    }
  };

  const getCategoryDistribution = (values: any[]): Record<string, number> => {
    try {
      const distribution: Record<string, number> = {};
      values.forEach(value => {
        // Convert value to string and limit length
        const strValue = String(value || '').slice(0, 50);
        distribution[strValue] = (distribution[strValue] || 0) + 1;
      });
      return distribution;
    } catch (error) {
      console.error('Error in getCategoryDistribution:', error);
      return {};
    }
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