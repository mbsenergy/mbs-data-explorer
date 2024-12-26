import { Card } from "@/components/ui/card";
import { FileText, Database, BarChart, Gem, Diamond, Trophy } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ColumnSummary {
  type: string;
  uniqueValues?: string[];
  min?: number;
  max?: number;
  mean?: number;
  nullCount: number;
  distribution?: Record<string, number>;
}

interface DataSummaryProps {
  data: any[];
  columns: ColumnDef<any>[];
}

export const DataSummary = ({ data, columns }: DataSummaryProps) => {
  const getColumnSummary = (columnName: string): ColumnSummary => {
    const values = data.map(row => row[columnName]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined);
    const nullCount = values.length - nonNullValues.length;

    const firstNonNullValue = nonNullValues[0];
    const type = typeof firstNonNullValue;

    if (type === 'number') {
      const numericValues = nonNullValues.map(Number);
      return {
        type: 'number',
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        nullCount,
        distribution: getNumericDistribution(numericValues)
      };
    } else {
      const uniqueValues = Array.from(new Set(nonNullValues));
      return {
        type: 'text',
        uniqueValues: uniqueValues.slice(0, 10),
        nullCount,
        distribution: getCategoryDistribution(nonNullValues)
      };
    }
  };

  const getNumericDistribution = (values: number[]): Record<string, number> => {
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
      distribution[value] = (distribution[value] || 0) + 1;
    });
    return distribution;
  };

  const getDistributionChart = (distribution: Record<string, number>, type: string): Highcharts.Options => {
    return {
      chart: {
        type: type === 'number' ? 'column' : 'pie',
        height: 200,
        backgroundColor: 'transparent'
      },
      title: { text: undefined },
      xAxis: type === 'number' ? {
        categories: Object.keys(distribution),
        labels: { rotation: -45 }
      } : undefined,
      yAxis: type === 'number' ? {
        title: { text: 'Count' }
      } : undefined,
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Distribution',
        type: type === 'number' ? 'column' : 'pie',
        data: type === 'number' 
          ? Object.values(distribution)
          : Object.entries(distribution).map(([name, y]) => ({ name, y }))
      }],
      credits: { enabled: false }
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-cyan-900 to-slate-900 border-cyan-700">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-cyan-400" />
            <h3 className="font-medium text-cyan-100">Total Rows</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {data.length.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-900 to-slate-900 border-purple-700">
          <div className="flex items-center gap-2">
            <Diamond className="h-5 w-5 text-purple-400" />
            <h3 className="font-medium text-purple-100">Total Columns</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
            {columns.length.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-900 to-slate-900 border-amber-700">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="font-medium text-amber-100">Data Points</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            {(data.length * columns.length).toLocaleString()}
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Column Analysis</h3>
        <div className="grid gap-4">
          {columns.map(col => {
            const columnId = String(col.id);
            const columnHeader = typeof col.header === 'function' ? col.header({}) : col.header;
            const summary = getColumnSummary(columnId);
            
            return (
              <Card key={columnId} className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <h4 className="font-medium text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {columnHeader}
                </h4>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">Type: <span className="text-white">{summary.type}</span></p>
                    <p className="text-slate-300">Null values: <span className="text-white">{summary.nullCount}</span></p>
                    {summary.type === 'number' && (
                      <>
                        <p className="text-slate-300">Min: <span className="text-white">{summary.min?.toLocaleString()}</span></p>
                        <p className="text-slate-300">Max: <span className="text-white">{summary.max?.toLocaleString()}</span></p>
                        <p className="text-slate-300">Mean: <span className="text-white">
                          {summary.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span></p>
                      </>
                    )}
                    {summary.type === 'text' && summary.uniqueValues && (
                      <div>
                        <p className="text-slate-300">Unique values ({Math.min(10, summary.uniqueValues.length)} of {summary.uniqueValues.length}):</p>
                        <ul className="mt-1 list-disc list-inside">
                          {summary.uniqueValues.map((value, index) => (
                            <li key={index} className="text-slate-400">{value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {summary.distribution && (
                    <div className="h-[200px]">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={getDistributionChart(summary.distribution, summary.type)}
                      />
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