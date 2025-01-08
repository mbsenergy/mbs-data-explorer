import { useState, useEffect } from "react";
import { useDatasetStore } from "@/stores/datasetStore";
import type { Filter } from "@/components/datasets/explore/types";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

export const useExploreState = (selectedDataset: TableNames | null) => {
  const { setExploreState, getExploreState } = useDatasetStore();
  
  // Initialize state from store or defaults
  const savedState = getExploreState();
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    savedState?.selectedColumns || []
  );
  const [filteredData, setFilteredData] = useState<any[]>(
    savedState?.data || []
  );
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

  // Save state to store whenever relevant state changes
  useEffect(() => {
    if (selectedDataset) {
      console.log("Saving explore state to store:", {
        selectedDataset,
        selectedColumns,
        filters,
        data: filteredData,
      });
      
      setExploreState({
        selectedDataset,
        selectedColumns,
        filters,
        data: filteredData,
        timestamp: Date.now()
      });
    }
  }, [selectedDataset, selectedColumns, filters, filteredData, setExploreState]);

  return {
    selectedColumns,
    setSelectedColumns,
    filteredData,
    setFilteredData,
    filters,
    setFilters
  };
};