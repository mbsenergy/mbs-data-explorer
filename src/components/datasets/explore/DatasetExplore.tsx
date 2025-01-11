import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
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
import type { Filter } from "@/components/datasets/explore/types";
import type { ColumnDef } from "@tanstack/react-table";

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
  const { addQueryResult, getQueryResult } = useDatasetStore();

  // Initialize state from store or defaults
  const savedState = selectedDataset ? getQueryResult(selectedDataset) : null;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    savedState?.columns?.map(col => (col as ColumnDef<any> & { accessorKey: string }).accessorKey) || []
  );
  const [filters, setFilters] = useState<Filter[]>([
    { 
      id: crypto.randomUUID(), 
      searchTerm: "", 
      selectedColumn: "", 
      operator: "AND",
      comparisonOperator: "=" 
    }
  ]);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  const {
    data,
    setData,
    columns,
    totalRowCount,
    isLoading,
    loadData,
    queryText,
    apiCall
  } = useDatasetData(selectedDataset);

  // Load initial data when dataset changes (first 1000 rows)
  useEffect(() => {
    if (selectedDataset) {
      const loadInitialData = async () => {
        try {
          await loadData("LIMIT 1000");
        } catch (error) {
          console.error("Error loading initial data:", error);
        }
      };
      loadInitialData();
    }
  }, [selectedDataset]);

  // Load saved data if available
  useEffect(() => {
    if (selectedDataset && savedState?.data) {
      setData(savedState.data);
      if (savedState.columns) {
        const columnNames = savedState.columns.map(col => 
          (col as ColumnDef<any> & { accessorKey: string }).accessorKey
        );
        setSelectedColumns(columnNames);
        onColumnsChange(columnNames);
      }
    }
  }, [selectedDataset, savedState]);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

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
        console.log("Filter conditions:", filterConditions);

        const filteredData = await loadData(filterConditions);
        console.log("Loaded data:", filteredData);

        // Store in cache
        addQueryResult(
          selectedDataset,
          filteredData,
          columns.map(col => ({ 
            accessorKey: col, 
            header: col 
          } as ColumnDef<any> & { accessorKey: string })),
          totalRowCount,
          queryText || ''
        );
        
        if (onLoad) {
          onLoad(selectedDataset);
        }
        
        toast({
          title: "Success",
          description: `Dataset loaded successfully with ${filteredData.length} rows`
        });
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

  const handleExport = () => {
    if (!data.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data available to export"
      });
      return;
    }

    try {
      const headers = selectedColumns.join(',');
      const rows = data.map(row => 
        selectedColumns.map(col => {
          const value = row[col];
          if (value === null) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDataset}_export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Data exported successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export data"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
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
        filteredRows={data.length}
        lastUpdate={data[0]?.md_last_update}
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

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <DatasetTable
          columns={columns}
          data={data}
          selectedColumns={selectedColumns}
        />
      )}

      {isQueryModalOpen && (
        <DatasetQueryModal
          isOpen={isQueryModalOpen}
          onClose={() => setIsQueryModalOpen(false)}
          query={queryText || ''}
          apiCall={apiCall || ''}
        />
      )}
    </Card>
  );
};