import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetTable } from "./DatasetTable";
import { DatasetPagination } from "./DatasetPagination";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { DatasetExploreHeader } from "./DatasetExploreHeader";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { useState } from "react";
import type { Filter } from "./types";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreContentProps {
  isLoading: boolean;
  columns: string[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  searchTerm: string;
  selectedColumn: string;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
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
  setIsQueryModalOpen: (isOpen: boolean) => void;
  onLoad?: () => void;
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
  const [currentQuery, setCurrentQuery] = useState("");

  const handleShowQuery = () => {
    const columnsStr = selectedColumns.length > 0 
      ? selectedColumns.map(col => `"${col}"`).join(', ')
      : '*';
    
    const query = `SELECT ${columnsStr} FROM "${selectedDataset}"`;
    setCurrentQuery(query);
    setIsQueryModalOpen(true);
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
      <DatasetExploreHeader
        selectedDataset={selectedDataset}
        onLoad={onLoad}
        onExport={onExport}
        onShowQuery={handleShowQuery}
        isLoading={isLoading}
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
        query={currentQuery}
        apiCall={`await supabase
  .from('${selectedDataset}')
  .select('${selectedColumns.join(", ")}')`}
      />
    </>
  );
};