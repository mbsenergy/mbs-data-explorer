import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useExploreState } from "@/hooks/useExploreState";
import { DatasetExploreContent } from "./DatasetExploreContent";
import { DatasetExploreHeader } from "./DatasetExploreHeader";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreContainerProps {
  selectedDataset: TableNames | null;
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
  } = useExploreState(selectedDataset);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadData,
    fetchPage
  } = useDatasetData(selectedDataset);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange, setSelectedColumns]);

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data, setFilteredData]);

  useEffect(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedData(filteredData.slice(start, end));
  }, [filteredData, currentPage]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData();
      if (onLoad && selectedDataset) {
        onLoad(selectedDataset);
      }
      toast({
        title: "Dataset Retrieved",
        description: `Successfully loaded ${selectedDataset}`
      });
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log("Exporting data...");
  };

  const handleShowQuery = () => {
    setIsQueryModalOpen(true);
  };

  const handlePageChange = async (newPage: number) => {
    if (fetchPage) {
      const pageData = await fetchPage(newPage, itemsPerPage);
      if (pageData) {
        setPaginatedData(pageData);
        setCurrentPage(newPage);
      }
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <DatasetExploreHeader 
        selectedDataset={selectedDataset}
        onLoad={handleLoad}
        onExport={handleExport}
        onShowQuery={handleShowQuery}
        isLoading={isLoading}
      />

      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data?.[0]?.md_last_update}
      />

      <DatasetExploreContent
        isLoading={isLoading}
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
    </Card>
  );
};