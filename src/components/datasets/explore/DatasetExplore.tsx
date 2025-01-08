import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetPagination } from "./DatasetPagination";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useDatasetStore } from "@/stores/datasetStore";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreProps {
  selectedDataset: TableNames | null;
  onColumnsChange: (columns: string[]) => void;
  onLoad?: (tableName: string) => void;
}

export const DatasetExplore = ({ 
  selectedDataset, 
  onColumnsChange,
  onLoad 
}: DatasetExploreProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);
  const itemsPerPage = 10;

  // Get state management functions from Zustand store
  const { setExploreState, getExploreState } = useDatasetStore();
  
  // Initialize state from store or defaults
  const savedState = getExploreState();
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    savedState?.selectedColumns || []
  );
  const [filteredData, setFilteredData] = useState<any[]>(
    savedState?.data || []
  );

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadData,
    fetchPage
  } = useDatasetData(selectedDataset);

  // Update columns when they change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  // Update filtered and paginated data when main data changes
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Setting filtered data:", data);
      setFilteredData(data);
      
      // Save to store
      if (selectedDataset) {
        setExploreState({
          selectedDataset,
          selectedColumns,
          data: data,
          timestamp: Date.now()
        });
      }
    }
  }, [data, selectedDataset, selectedColumns, setExploreState]);

  // Update paginated data when filtered data changes
  useEffect(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedData(filteredData.slice(start, end));
  }, [filteredData, currentPage]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData();
      if (onLoad) {
        onLoad(selectedDataset);
      }
      toast({
        title: "Dataset Retrieved",
        description: `Successfully loaded ${selectedDataset}`
      });
    }
  };

  const filteredDataset = filteredData.filter((item) =>
    selectedColumn
      ? String(item[selectedColumn])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : Object.entries(item)
          .filter(([key]) => !key.startsWith('md_'))
          .some(([_, value]) => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
  );

  const totalPages = Math.ceil(filteredDataset.length / itemsPerPage);

  const handleColumnSelect = (column: string) => {
    const newColumns = selectedColumns.includes(column)
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newColumns);
    onColumnsChange(newColumns);

    // Save to store when columns change
    if (selectedDataset) {
      setExploreState({
        selectedDataset,
        selectedColumns: newColumns,
        data: filteredData,
        timestamp: Date.now()
      });
    }
  };

  const handlePageChange = async (newPage: number) => {
    const pageData = await fetchPage(newPage, itemsPerPage);
    if (pageData) {
      setPaginatedData(pageData);
      setCurrentPage(newPage);
    }
  };

  const getLastUpdate = (data: any[]) => {
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const item = data[0] as Record<string, unknown>;
      return item.md_last_update as string | null;
    }
    return null;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Explore</h2>
          {selectedDataset && (
            <p className="text-muted-foreground">
              Selected dataset: <span className="font-medium">{selectedDataset}</span>
            </p>
          )}
        </div>
        <div className="space-x-2">
          {onLoad && (
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLoad}
              className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
            >
              Retrieve
            </Button>
          )}
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '#sample'}
            className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
          >
            Export
          </Button>
        </div>
      </div>
      
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredDataset.length}
        lastUpdate={getLastUpdate(data)}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <>
          <DatasetControls
            columns={columns}
            searchTerm={searchTerm}
            selectedColumn={selectedColumn}
            onSearchChange={setSearchTerm}
            onColumnChange={setSelectedColumn}
          />

          <DatasetColumnSelect
            columns={columns}
            selectedColumns={selectedColumns}
            onColumnSelect={handleColumnSelect}
          />

          <DatasetTable
            columns={columns}
            data={paginatedData}
            selectedColumns={selectedColumns}
          />

          <DatasetPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
};