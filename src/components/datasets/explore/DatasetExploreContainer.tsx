import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useExploreState } from "@/hooks/useExploreState";
import { DatasetExploreHeader } from "./DatasetExploreHeader";
import { DatasetExploreContent } from "./DatasetExploreContent";
import type { Filter } from "./types";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreContainerProps {
  selectedDataset: string | null;
  onColumnsChange: (columns: string[]) => void;
  onLoad?: (tableName: string) => void;
}

export const DatasetExploreContainer = ({
  selectedDataset,
  onColumnsChange,
  onLoad
}: DatasetExploreContainerProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const itemsPerPage = 10;

  const {
    selectedColumns,
    setSelectedColumns,
    filteredData,
    setFilteredData,
    filters,
    setFilters
  } = useExploreState(selectedDataset as TableNames);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadData
  } = useDatasetData(selectedDataset as TableNames);

  // Update columns when they change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange, setSelectedColumns]);

  // Update filtered data when main data changes
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Setting filtered data:", data);
      setFilteredData(data);
    }
  }, [data, setFilteredData]);

  // Update paginated data when filtered data changes
  useEffect(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedData(filteredData.slice(start, end));
  }, [filteredData, currentPage]);

  const handleLoad = async () => {
    if (!selectedDataset) return;

    try {
      await loadData();
      
      if (onLoad) {
        onLoad(selectedDataset);
      }

      toast({
        title: "Dataset Retrieved",
        description: `Successfully retrieved ${selectedDataset}`
      });
    } catch (error: any) {
      console.error("Error loading dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to retrieve dataset"
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Card className="p-6 space-y-6 metallic-card">
      <DatasetExploreHeader
        selectedDataset={selectedDataset}
        onLoad={handleLoad}
        onShowQuery={() => setIsQueryModalOpen(true)}
        isLoading={isLoading}
      />

      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data?.[0]?.md_last_update}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <DatasetExploreContent
          columns={columns}
          selectedColumns={selectedColumns}
          onColumnsChange={onColumnsChange}
          searchTerm={searchTerm}
          selectedColumn={selectedColumn}
          onSearchChange={setSearchTerm}
          onColumnChange={setSelectedColumn}
          paginatedData={paginatedData}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={handlePageChange}
          onColumnSelect={(column) => {
            const newColumns = selectedColumns.includes(column)
              ? selectedColumns.filter(col => col !== column)
              : [...selectedColumns, column];
            
            setSelectedColumns(newColumns);
            onColumnsChange(newColumns);
          }}
          filters={filters}
          setFilters={setFilters}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          data={data}
          selectedDataset={selectedDataset}
          isQueryModalOpen={isQueryModalOpen}
          setIsQueryModalOpen={setIsQueryModalOpen}
        />
      )}
    </Card>
  );
};