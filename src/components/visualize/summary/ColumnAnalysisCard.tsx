import { Card } from "@/components/ui/card";
import { ColumnDef, Table, RowModel, RowData, Column } from "@tanstack/react-table";
import { ColumnDistributionChart } from "./ColumnDistributionChart";
import { getCoreRowModel, createColumnHelper } from "@tanstack/react-table";

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
  const columnHelper = createColumnHelper<any>();

  const getColumnHeader = () => {
    if (typeof column.header === 'function') {
      const mockColumn = {
        id: String(column.id),
        columnDef: column,
        columns: [],
        depth: 0,
        getFlatColumns: () => [],
        getIsGrouped: () => false,
        getIsPinned: () => null,
        getIsResizing: () => false,
        getIsSorted: () => false,
        getIsVisible: () => true,
        getLeafColumns: () => [],
        getParentColumns: () => [],
        getPin: () => null,
        getPinnedIndex: () => 0,
        getSortIndex: () => 0,
        getStart: () => 0,
        getSize: () => 0,
        getTotalSize: () => 0,
        getToggleSortingHandler: () => null,
        getCanSort: () => false,
        getCanPin: () => false,
        getCanResize: () => false,
        getCanFilter: () => false,
        getCanGlobalFilter: () => false,
        getIsFiltered: () => false,
        getFilterValue: () => undefined,
        getAutoFilterFn: () => undefined,
        setFilterValue: () => {},
        getFilterIndex: () => 0,
        resetFilter: () => {},
        resetSorting: () => {},
        getFirstColumn: () => null,
        getLastColumn: () => null,
        header: String(column.id),
      } as unknown as Column<any>;

      const mockTable = {
        options: {
          data,
          columns: [column],
          getCoreRowModel,
          state: {},
          onStateChange: () => {},
        },
        getHeaderGroups: () => [],
        getRowModel: () => ({ rows: [] }),
        getState: () => ({}),
        setOptions: () => {},
        reset: () => {},
        getColumn: () => null,
      } as unknown as Table<any>;

      const headerContext = {
        column: mockColumn,
        header: mockColumn,
        table: mockTable,
      };

      return column.header(headerContext);
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