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
import { useDatasetStore } from "@/stores/datasetStore";
import type { Filter } from "./types";
import type { Database } from "@/integrations/supabase/types";
import { v4 as uuidv4 } from 'uuid';

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
  const { user } = useAuth();
  const { setExploreState, getExploreState } = useDatasetStore();

  // Initialize state from store
  const savedState = getExploreState();
  const [filters, setFilters] = useState<Filter[]>(
    savedState?.filters || [
      { 
        id: uuidv4(), 
        searchTerm: "", 
        selectedColumn: "", 
        operator: "AND",
        comparisonOperator: "=" 
      }
    ]
  );
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    savedState?.selectedColumns || []
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>(savedState?.data || []);
  const [pageSize] = useState(20);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData
  } = useDatasetData(selectedDataset as TableNames | null);

  // Save state to store whenever it changes
  useEffect(() => {
    if (selectedDataset) {
      setExploreState({
        selectedDataset: selectedDataset as TableNames,
        selectedColumns,
        filters,
        data: filteredData,
        timestamp: Date.now()
      });
    }
  }, [selectedDataset, selectedColumns, filters, filteredData]);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData();
      if (onLoad) {
        onLoad(selectedDataset);
      }
    }
  };

  const handleExport = async () => {
    if (!selectedDataset || !user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a dataset and ensure you're logged in."
      });
      return;
    }

    try {
      const { error: analyticsError } = await supabase
        .from("analytics")
        .insert({
          user_id: user.id,
          dataset_name: selectedDataset,
          is_custom_query: false,
        });

      if (analyticsError) {
        console.error("Error tracking export:", analyticsError);
      }

      toast({
        title: "Success",
        description: "Dataset exported successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to export dataset"
      });
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

  const getLastUpdate = (data: any[]) => {
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const item = data[0] as Record<string, unknown>;
      return item.md_last_update as string | null;
    }
    return null;
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
          onExport={handleExport}
          onShowQuery={() => setIsQueryModalOpen(true)}
          isLoading={isLoading}
        />
      </div>

      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={getLastUpdate(data)}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DatasetFilters
            columns={columns}
            filters={filters}
            onFilterChange={(filterId, field, value) => {
              setFilters(filters.map(f =>
                f.id === filterId
                  ? { ...f, [field]: value }
                  : f
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
              setFilters(filters.filter(f => f.id !== filterId));
            }}
          />

          <DatasetColumnSelect
            columns={columns}
            selectedColumns={selectedColumns}
            onColumnSelect={handleColumnSelect}
          />

          <DatasetTable
            columns={columns}
            data={filteredData}
            selectedColumns={selectedColumns}
          />

          <DatasetQueryModal
            isOpen={isQueryModalOpen}
            onClose={() => setIsQueryModalOpen(false)}
            query={`SELECT ${selectedColumns.join(', ')} FROM "${selectedDataset}"`}
            apiCall={`await supabase
  .from('${selectedDataset}')
  .select('${selectedColumns.join(', ')}')`
    + (filters.length > 0 ? "\n  // Filters would need to be applied in JavaScript" : "")}
          />
        </div>
      )}
    </Card>
  );
};