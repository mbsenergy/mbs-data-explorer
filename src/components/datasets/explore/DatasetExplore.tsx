import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetExploreActions } from "./DatasetExploreActions";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { DatasetFilters } from "./DatasetFilters";
import { useDatasetData } from "@/hooks/useDatasetData";
import type { Database } from "@/integrations/supabase/types";
import type { Filter } from "./types";

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
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([{
    id: crypto.randomUUID(),
    searchTerm: "",
    selectedColumn: "",
    operator: "AND",
    comparisonOperator: "="
  }]);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadData,
    loadInitialData,
    queryText,
    apiCall
  } = useDatasetData(selectedDataset);

  // Load initial data when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      loadInitialData();
    }
  }, [selectedDataset, loadInitialData]);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData();
      if (onLoad) {
        onLoad(selectedDataset);
      }
    }
  };

  const filteredData = data.filter((item) =>
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
          onExport={() => window.location.href = '#sample'}
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
            query={queryText}
            apiCall={apiCall}
          />
        </>
      )}
    </Card>
  );
};