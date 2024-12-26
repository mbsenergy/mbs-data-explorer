import { Card } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnDistributionChart } from "./ColumnDistributionChart";
import { getCoreRowModel } from "@tanstack/react-table";

interface ColumnAnalysisCardProps {
  column: ColumnDef<any>;
  data: any[];
  summary: {
    type: string;
    uniqueValues?: string[];
    min?: number;
    max?: number;
    mean?: number;
    nullCount: number;
    distribution?: Record<string, number>;
  };
}

export const ColumnAnalysisCard = ({ column, data, summary }: ColumnAnalysisCardProps) => {
  const getColumnHeader = () => {
    if (typeof column.header === 'function') {
      return column.header({
        column: {
          ...column,
          getCanSort: () => false,
          getIsSorted: () => false,
          getSortIndex: () => 0,
          getToggleSortingHandler: () => null,
        },
        header: column.header,
        table: {
          options: {
            data,
            columns: [column],
            getCoreRowModel,
            state: {},
            onStateChange: () => {},
          },
        },
      });
    }
    return column.header;
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <h4 className="font-medium text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        {getColumnHeader()}
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
          <ColumnDistributionChart
            distribution={summary.distribution}
            type={summary.type}
          />
        )}
      </div>
    </Card>
  );
};