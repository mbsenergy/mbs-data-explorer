import { useMemo } from 'react';
import { DataGrid } from "@/components/datasets/query/DataGrid";
import type { ColumnDef } from "@tanstack/react-table";

interface DatasetTableProps {
  columns: ColumnDef<any, any>[];
  data: any[];
  selectedColumns: string[];
}

export const DatasetTable = ({ columns, data, selectedColumns }: DatasetTableProps) => {
  // Memoize the table columns to prevent unnecessary re-renders
  const tableColumns = useMemo(() => {
    return columns.map((col): ColumnDef<any> => ({
      ...col,
      cell: info => {
        const value = info.getValue();
        return value === null ? 'NULL' : String(value);
      },
    }));
  }, [columns]);

  return (
    <div className="border rounded-md">
      <DataGrid
        data={data}
        columns={tableColumns}
      />
    </div>
  );
};