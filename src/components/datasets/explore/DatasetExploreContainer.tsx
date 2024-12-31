import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetFilters } from "./DatasetFilters";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { DatasetExploreActions } from "./DatasetExploreActions";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { Filter } from "./types";
import { v4 as uuidv4 } from 'uuid';

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
  const [filters, setFilters] = useState<Filter[]>([
    { 
      id: uuidv4(), 
      searchTerm: "", 
      selectedColumn: "", 
      operator: "AND",
      comparisonOperator: "=" 
    }
  ]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [pageSize] = useState(20);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData
  } = useDatasetData(selectedDataset);

  // Reset selected columns when columns change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  // Update filtered data when raw data changes
  useEffect(() => {
    if (data) {
      setFilteredData(data);
      setShouldApplyFilters(false);
    }
  }, [data]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData(selectedDataset, selectedColumns, true);
      if (onLoad) {
        onLoad(selectedDataset);
      }
    }
  };

  const handleColumnSelect = (column: string) => {
    const newColumns = selectedColumns.includes(column)
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newColumns);
    onColumnsChange(newColumns);
  };

  const handlePageChange = async (newPage: number) => {
    const pageData = await fetchPage(newPage, pageSize);
    if (pageData) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="p-6 space-y-6 metallic-card">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Explore</h2>
          </div>
          {selectedDataset && (
            <p className="text-muted-foreground">
              Selected dataset: <span className="font-medium">{selectedDataset}</span>
            </p>
          )}
        </div>
        <DatasetExploreActions
          selectedDataset={selectedDataset}
          onRetrieve={handleLoad}
          onShowQuery={() => setIsQueryModalOpen(true)}
          isLoading={isLoading}
        />
      </div>

      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data[0]?.md_last_update || null}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <DatasetExploreContent 
          columns={columns}
          selectedColumns={selectedColumns}
          filters={filters}
          setFilters={setFilters}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          onColumnSelect={handleColumnSelect}
          data={data}
          isQueryModalOpen={isQueryModalOpen}
          setIsQueryModalOpen={setIsQueryModalOpen}
          selectedDataset={selectedDataset}
        />
      )}
    </Card>
  );
};