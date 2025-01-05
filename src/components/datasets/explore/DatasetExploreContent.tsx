import { DatasetStats } from "./DatasetStats";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetTable } from "./DatasetTable";
import { DatasetPagination } from "./DatasetPagination";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

interface DatasetExploreContentProps {
  isLoading: boolean;
  data: any[];
  columns: ColumnDef<any, any>[];
  columnNames: string[];
  selectedColumn: string;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  selectedColumns: string[];
  totalRowCount: number;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
  onColumnSelect: (column: string) => void;
  onPageChange: (page: number) => void;
}

export const DatasetExploreContent = ({
  isLoading,
  data,
  columns,
  columnNames,
  selectedColumn,
  searchTerm,
  currentPage,
  totalPages,
  selectedColumns,
  totalRowCount,
  onSearchChange,
  onColumnChange,
  onColumnSelect,
  onPageChange,
}: DatasetExploreContentProps) => {
  const getLastUpdate = (data: any[]) => {
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const item = data[0] as Record<string, unknown>;
      return item.md_last_update as string | null;
    }
    return null;
  };

  // Memoize the filtered columns to prevent unnecessary re-renders
  const filteredColumns = useMemo(() => 
    columns.filter(col => selectedColumns.includes(col.id as string)),
    [columns, selectedColumns]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p>Loading dataset...</p>
      </div>
    );
  }

  return (
    <>
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columnNames.length}
        filteredRows={data.length}
        lastUpdate={getLastUpdate(data)}
      />

      <DatasetControls
        columns={columnNames}
        searchTerm={searchTerm}
        selectedColumn={selectedColumn}
        onSearchChange={onSearchChange}
        onColumnChange={onColumnChange}
      />

      <DatasetColumnSelect
        columns={columnNames}
        selectedColumns={selectedColumns}
        onColumnSelect={onColumnSelect}
      />

      <DatasetTable
        columns={filteredColumns}
        data={data}
        selectedColumns={selectedColumns}
      />

      <DatasetPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};