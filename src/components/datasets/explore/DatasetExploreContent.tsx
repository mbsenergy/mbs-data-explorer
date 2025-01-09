import { Dispatch, SetStateAction } from "react";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetTable } from "./DatasetTable";
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
  data: any[];
  onColumnSelect: (column: string) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  filteredData: any[];
  setFilteredData: (data: any[]) => void;
  selectedDataset: TableNames | null;
  isQueryModalOpen: boolean;
  setIsQueryModalOpen: Dispatch<SetStateAction<boolean>>;
  onLoad?: () => Promise<void>;
  onExport: () => void;
  queryText: string;
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
  data,
  onColumnSelect,
  filters,
  setFilters,
  filteredData,
  setFilteredData,
  selectedDataset,
  isQueryModalOpen,
  setIsQueryModalOpen,
  onLoad,
  onExport,
  queryText
}: DatasetExploreContentProps) => {
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
        onShowQuery={() => setIsQueryModalOpen(true)}
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
        data={data}
        selectedColumns={selectedColumns}
      />

      <DatasetQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        query={queryText}
        apiCall={`await supabase
  .from('${selectedDataset}')
  .select('${selectedColumns.join(", ")}')`}
      />
    </>
  );
};