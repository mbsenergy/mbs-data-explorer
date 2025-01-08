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
        id: crypto.randomUUID(), 
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
      console.log("Setting filtered data:", data);
      setFilteredData(data);
    }
  }, [data]);

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

  const handleExport = async () => {
    if (!selectedDataset || !user?.id || !selectedColumns.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one column to export.",
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
          filters={filters}
          setFilters={setFilters}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          onColumnSelect={(column) => {
            const newColumns = selectedColumns.includes(column)
              ? selectedColumns.filter(col => col !== column)
              : [...selectedColumns, column];
            
            setSelectedColumns(newColumns);
            onColumnsChange(newColumns);
          }}
          data={data || []}
          isQueryModalOpen={isQueryModalOpen}
          setIsQueryModalOpen={setIsQueryModalOpen}
          selectedDataset={selectedDataset}
        />
      )}
    </Card>
  );
};