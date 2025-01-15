import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetExploreActions } from "./DatasetExploreActions";
import { DatasetFilters } from "./DatasetFilters";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useExploreState } from "@/hooks/useExploreState";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

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
    queryText,
    loadInitialData
  } = useDatasetData(selectedDataset);

  // Update selected columns when columns change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange, setSelectedColumns]);

  // Load initial 1000 rows when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      console.log("Loading initial data for dataset:", selectedDataset);
      loadInitialData();
    }
  }, [selectedDataset, loadInitialData]);

  // Update filtered data when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Setting filtered data from data update:", data.length);
      setFilteredData(data);
    }
  }, [data, setFilteredData]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      try {
        // If no filters are applied, use a simple SELECT * query
        const hasActiveFilters = filters.some(filter => 
          filter.searchTerm && filter.selectedColumn
        );

        await loadData(hasActiveFilters ? undefined : `SELECT * FROM "${selectedDataset}"`);
        
        if (onLoad) {
          onLoad(selectedDataset);
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
      }
    }
  };

  const handleExport = () => {
    // Export functionality will be implemented here
    console.log("Export clicked");
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
        <>
          <DatasetFilters
            columns={columns}
            filters={filters}
            onFilterChange={(filterId, field, value) => {
              setFilters(filters.map(filter => 
                filter.id === filterId 
                  ? { ...filter, [field]: value }
                  : filter
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
              setFilters(filters.filter(filter => filter.id !== filterId));
            }}
          />

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
            onColumnSelect={(column) => {
              const newColumns = selectedColumns.includes(column)
                ? selectedColumns.filter(col => col !== column)
                : [...selectedColumns, column];
              
              setSelectedColumns(newColumns);
              onColumnsChange(newColumns);
            }}
          />

          <DatasetTable
            columns={columns}
            data={filteredData}
            selectedColumns={selectedColumns}
          />
        </>
      )}

      <DatasetQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        query={queryText}
        apiCall={`await supabase
  .from('${selectedDataset}')
  .select('${selectedColumns.join(", ")}')`}
      />
    </Card>
  );
};