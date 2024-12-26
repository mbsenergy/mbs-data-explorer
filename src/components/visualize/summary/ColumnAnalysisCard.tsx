import { Card } from "@/components/ui/card";
import { ColumnDef, Table, RowModel, RowData, Column, Header } from "@tanstack/react-table";
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

      const mockHeader = {
        id: String(column.id),
        index: 0,
        depth: 0,
        column: mockColumn,
        headerGroup: {
          depth: 0,
          headers: [],
          id: '0',
        },
        subHeaders: [],
        colSpan: 1,
        rowSpan: 1,
        getLeafHeaders: () => [],
        isPlaceholder: false,
        placeholderId: undefined,
        getContext: () => ({ table: mockTable, header: mockHeader, column: mockColumn }),
      } as unknown as Header<any, unknown>;

      const headerContext = {
        column: mockColumn,
        header: mockHeader,
        table: mockTable,
      };

      return column.header(headerContext);
    }
    return column.header;
  };

  return (
    <Card className="p-4 metallic-card">
      <h4 className="font-medium text-lg">
        {getColumnHeader()}
      </h4>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">Type: <span className="text-foreground">{summary.type}</span></p>
          <p className="text-muted-foreground">Null values: <span className="text-foreground">{summary.nullCount}</span></p>
          {summary.type === 'number' && (
            <>
              <p className="text-muted-foreground">Min: <span className="text-foreground">{summary.min?.toLocaleString()}</span></p>
              <p className="text-muted-foreground">Max: <span className="text-foreground">{summary.max?.toLocaleString()}</span></p>
              <p className="text-muted-foreground">Mean: <span className="text-foreground">
                {summary.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span></p>
            </>
          )}
          {summary.type === 'text' && summary.uniqueValues && (
            <div>
              <p className="text-muted-foreground">Unique values ({Math.min(10, summary.uniqueValues.length)} of {summary.uniqueValues.length}):</p>
              <ul className="mt-1 list-disc list-inside">
                {summary.uniqueValues.map((value, index) => (
                  <li key={index} className="text-muted-foreground">{value}</li>
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