import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetControls } from "./DatasetControls";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetExploreHeader } from "./DatasetExploreHeader";
import { DatasetFilters } from "./DatasetFilters";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([{
    id: crypto.randomUUID(),
    searchTerm: "",
    selectedColumn: "",
    operator: "AND",
    comparisonOperator: "="
  }]);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  const {
    data,
    setData, // Add this to update the table data
    columns,
    totalRowCount,
    isLoading,
    loadData,
    queryText
  } = useDatasetData(selectedDataset);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      try {
        console.log("Current filters:", filters); // Debug log

        // Build filter conditions from the filters array
        const filterConditions = filters
          .filter(f => f.searchTerm && f.selectedColumn)
          .map((filter, index) => {
            const value = isNaN(Number(filter.searchTerm)) 
              ? `'${filter.searchTerm}'` 
              : filter.searchTerm;
            const condition = `${filter.selectedColumn} ${filter.comparisonOperator} ${value}`;
            return index === 0 ? condition : `${filter.operator} ${condition}`;
          })
          .join(' ');

        console.log("Generated filter conditions:", filterConditions); // Debug log

        const filteredData = await loadData(filterConditions);
        console.log("Filtered data received:", filteredData); // Debug log

        // Update the table data with the filtered results
        setData(filteredData);
        
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

      {isQueryModalOpen && queryText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">SQL Query</h3>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>{queryText}</code>
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};