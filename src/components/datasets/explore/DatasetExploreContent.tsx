import { Dispatch, SetStateAction } from "react";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetTable } from "./DatasetTable";
import { DatasetPagination } from "./DatasetPagination";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { DatasetExploreActions } from "./DatasetExploreActions";
import { DatasetFilters } from "./DatasetFilters";
import type { Filter } from "./types";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

export interface DatasetExploreContentProps {
  isLoading: boolean;
  columns: string[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  searchTerm: string;
  selectedColumn: string;
  onSearchChange: Dispatch<SetStateAction<string>>;
  onColumnChange: Dispatch<SetStateAction<string>>;
  paginatedData: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onColumnSelect: (column: string) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  filteredData: any[];
  setFilteredData: (data: any[]) => void;
  data: any[];
  selectedDataset: TableNames | null;
  isQueryModalOpen: boolean;
  setIsQueryModalOpen: Dispatch<SetStateAction<boolean>>;
  onLoad?: () => Promise<void>;
  onExport: () => void;
}

export const DatasetExploreContent = ({
  isLoading,
  columns,
  selectedColumns,
  onColumnsChange,
  searchTerm,
  selectedColumn,
  onSearchChange,
  onColumnChange,
  paginatedData,
  currentPage,
  totalPages,
  onPageChange,
  onColumnSelect,
  filters,
  setFilters,
  filteredData,
  setFilteredData,
  data,
  selectedDataset,
  isQueryModalOpen,
  setIsQueryModalOpen,
  onLoad,
  onExport
}: DatasetExploreContentProps) => {
  const handleShowQuery = () => {
    setIsQueryModalOpen(true);
  };

  const getQueryString = () => {
    if (!selectedDataset) return "";
    const columnsStr = selectedColumns.length > 0 
      ? selectedColumns.map(col => `"${col}"`).join(', ')
      : '*';
    return `SELECT ${columnsStr} FROM "${selectedDataset}"`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p>Loading dataset...</p>
      </div>
    );
  }

  return (
    <>
      <DatasetExploreActions
        selectedDataset={selectedDataset}
        onRetrieve={onLoad}
        onExport={onExport}
        onShowQuery={handleShowQuery}
        isLoading={isLoading}
      />

      <DatasetFilters
        columns={columns}
        filters={filters}
        onFilterChange={(filterId, field, value) => {
          setFilters(filters.map(filter => 
            filter.id === filterId 
              ? { ...filter, [field]: value }
              : filter
          ));
        }}
        onAddFilter={() => {
          setFilters([...filters, {
            id: crypto.randomUUID(),
            searchTerm: "",
            selectedColumn: "",
            operator: "AND",
            comparisonOperator: "="
          }]);
        }}
        onRemoveFilter={(filterId) => {
          setFilters(filters.filter(filter => filter.id !== filterId));
        }}
      />

      <DatasetControls
        columns={columns}
        searchTerm={searchTerm}
        selectedColumn={selectedColumn}
        onSearchChange={onSearchChange}
        onColumnChange={onColumnChange}
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

      <DatasetQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        query={getQueryString()}
        apiCall={`await supabase
  .from('${selectedDataset}')
  .select('${selectedColumns.join(", ")}')`}
      />
    </>
  );
};