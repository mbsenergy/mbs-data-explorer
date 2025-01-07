import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useDatasetStore } from "@/stores/datasetStore";
import { DatasetExploreHeader } from "./DatasetExploreHeader";
import { DatasetExploreContent } from "./DatasetExploreContent";
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

  // Initialize state from store or defaults
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
  const [filteredData, setFilteredData] = useState<any[]>(savedState?.data || []);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData
  } = useDatasetData(selectedDataset as TableNames | null);

  // Save state to store whenever relevant state changes
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
  }, [selectedDataset, selectedColumns, filters, filteredData, setExploreState]);

  // Update columns when they change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  // Update filtered data when source data changes
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
      toast({
        title: "Dataset Loaded",
        description: `Successfully loaded ${selectedDataset}`
      });
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

  const getLastUpdate = (data: any[]) => {
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const item = data[0] as Record<string, unknown>;
      return item.md_last_update as string | null;
    }
    return null;
  };

  return (
    <Card className="p-6 space-y-6 metallic-card">
      <DatasetExploreHeader
        selectedDataset={selectedDataset}
        onLoad={handleLoad}
        onExport={handleExport}
        onShowQuery={() => setIsQueryModalOpen(true)}
        isLoading={isLoading}
      />

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