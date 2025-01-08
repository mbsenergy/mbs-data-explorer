import { Dispatch, SetStateAction } from "react";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetTable } from "./DatasetTable";
import { DatasetPagination } from "./DatasetPagination";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
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
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowQuery}
          className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
        >
          <Code className="h-4 w-4 mr-2" />
          Show Query
        </Button>
      </div>

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