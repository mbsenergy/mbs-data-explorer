import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetTable } from "./DatasetTable";
import { DatasetPagination } from "./DatasetPagination";
import type { TableNames } from "../types";

interface DatasetContentProps {
  isLoading: boolean;
  columns: string[];
  searchTerm: string;
  selectedColumn: string;
  selectedColumns: string[];
  paginatedData: any[];
  currentPage: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
  onColumnSelect: (column: string) => void;
  onPageChange: (page: number) => void;
  onLoad?: (tableName: TableNames) => void;
  onDownload?: (tableName: TableNames) => void;
  selectedDataset: TableNames | null;
}

export const DatasetContent = ({
  isLoading,
  columns,
  searchTerm,
  selectedColumn,
  selectedColumns,
  paginatedData,
  currentPage,
  totalPages,
  onSearchChange,
  onColumnChange,
  onColumnSelect,
  onPageChange,
  onLoad,
  onDownload,
  selectedDataset
}: DatasetContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p>Loading dataset...</p>
      </div>
    );
  }

  return (
    <>
      <DatasetControls
        columns={columns}
        searchTerm={searchTerm}
        selectedColumn={selectedColumn}
        onSearchChange={onSearchChange}
        onColumnChange={onColumnChange}
        onLoad={onLoad}
        onDownload={onDownload}
        selectedDataset={selectedDataset}
      />

      <DatasetColumnSelect
        columns={columns}
        selectedColumns={selectedColumns}
        onColumnSelect={onColumnSelect}
      />

      <DatasetTable
        columns={columns}
        data={paginatedData}
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