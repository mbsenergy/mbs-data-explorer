import { useMemo } from 'react';
import { DataGrid } from "@/components/datasets/query/DataGrid";
import type { ColumnDefWithAccessor } from "@/components/datasets/types";

interface DatasetTableProps {
  columns: string[];
  data: any[];
  selectedColumns: string[];
}

export const DatasetTable = ({ columns, data, selectedColumns }: DatasetTableProps) => {
  const tableColumns = useMemo(() => {
    return selectedColumns.map((col): ColumnDefWithAccessor => ({
      accessorKey: col,
      header: col,
      cell: info => String(info.getValue() ?? ''),
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