import { useMemo } from 'react';
import { DataGrid } from "@/components/datasets/query/DataGrid";
import type { ColumnDef } from "@tanstack/react-table";

interface DatasetTableProps {
  columns: string[];
  data: any[];
  selectedColumns: string[];
}

export const DatasetTable = ({ columns, data, selectedColumns }: DatasetTableProps) => {
  const tableColumns = useMemo(() => {
    return selectedColumns.map((col): ColumnDef<any> => ({
      accessorKey: col,
      header: col,
    }));
  }, [selectedColumns]);

  return (
    <div className="border rounded-md">
      <DataGrid
        data={data}
        columns={tableColumns}
      />
    </div>
  );
};