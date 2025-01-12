import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetTable } from "./DatasetTable";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetExploreHeader } from "./DatasetExploreHeader";
import { DatasetFilters } from "./DatasetFilters";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useDatasetStore } from "@/stores/datasetStore";
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
  const { toast } = useToast();
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const { addQueryResult, getQueryResult } = useDatasetStore();

  // Initialize state from store or defaults
  const savedState = selectedDataset ? getQueryResult(selectedDataset) : null;
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    savedState?.columns?.map(col => (col as any).accessorKey) || []
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

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadData,
    queryText,
    setData
  } = useDatasetData(selectedDataset);

  // Update selected columns when columns change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  // Load initial data when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      loadData();
    }
  }, [selectedDataset]);

  const buildFilterConditions = (filters: Filter[]): string => {
    const validFilters = filters.filter(f => f.searchTerm && f.selectedColumn);
    if (validFilters.length === 0) return "";

    return validFilters
      .map((filter, index) => {
        const columnName = `"${filter.selectedColumn}"`;
        let value = filter.searchTerm;
        
        if (filter.comparisonOperator === 'IN' || filter.comparisonOperator === 'NOT IN') {
          const values = value.split(',').map(v => 
            isNaN(Number(v.trim())) ? `'${v.trim()}'` : v.trim()
          );
          value = `(${values.join(', ')})`;
        } else {
          value = isNaN(Number(value)) ? `'${value}'` : value;
        }

        const condition = `${columnName} ${filter.comparisonOperator} ${value}`;
        return index === 0 ? condition : `${filter.operator} ${condition}`;
      })
      .join(' ');
  };

  const handleLoad = async () => {
    if (selectedDataset) {
      try {
        const filterConditions = buildFilterConditions(filters);
        const data = await loadData(filterConditions);
        
        if (onLoad) {
          onLoad(selectedDataset);
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load dataset"
        });
      }
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <DatasetExploreHeader 
        selectedDataset={selectedDataset}
        onLoad={handleLoad}
        onShowQuery={() => setIsQueryModalOpen(true)}
        isLoading={isLoading}
      />

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
        searchTerm=""
        selectedColumn=""
        onSearchChange={() => {}}
        onColumnChange={() => {}}
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
        data={data}
        selectedColumns={selectedColumns}
      />

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