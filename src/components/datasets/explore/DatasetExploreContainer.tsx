import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useExploreState } from "@/hooks/useExploreState";
import { DatasetExploreContent } from "./DatasetExploreContent";
import { DatasetExploreHeader } from "./DatasetExploreHeader";
import type { Database } from "@/integrations/supabase/types";
import type { Filter } from "./types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreContainerProps {
  selectedDataset: TableNames | null;
  onColumnsChange: (columns: string[]) => void;
  onLoad?: (tableName: string) => void;
}

export const DatasetExploreContainer = ({ 
  selectedDataset, 
  onColumnsChange,
  onLoad 
}: DatasetExploreContainerProps) => {
  const { toast } = useToast();
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
    queryText
  } = useDatasetData(selectedDataset);

  // Update selected columns when columns change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange, setSelectedColumns]);

  // Load initial data when dataset changes
  useEffect(() => {
    if (selectedDataset && loadData) {
      loadData();
    }
  }, [selectedDataset, loadData]);

  // Update filtered data when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data, setFilteredData]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      try {
        await loadData();
        if (onLoad) {
          onLoad(selectedDataset);
        }
        toast({
          title: "Success",
          description: `Successfully loaded ${selectedDataset}`
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load dataset"
        });
      }
    }
  };

  const handleExport = () => {
    if (!selectedDataset || !filteredData.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data available to export"
      });
      return;
    }

    try {
      const headers = selectedColumns.join(',');
      const rows = filteredData.map(row => 
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

      <DatasetExploreContent
        isLoading={isLoading}
        columns={columns}
        selectedColumns={selectedColumns}
        onColumnsChange={onColumnsChange}
        searchTerm={searchTerm}
        selectedColumn={selectedColumn}
        onSearchChange={setSearchTerm}
        onColumnChange={setSelectedColumn}
        data={data}
        onColumnSelect={(column) => {
          const newColumns = selectedColumns.includes(column)
            ? selectedColumns.filter(col => col !== column)
            : [...selectedColumns, column];
          
          setSelectedColumns(newColumns);
          onColumnsChange(newColumns);
        }}
        filters={filters}
        setFilters={setFilters}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        selectedDataset={selectedDataset}
        isQueryModalOpen={isQueryModalOpen}
        setIsQueryModalOpen={setIsQueryModalOpen}
        onLoad={handleLoad}
        onExport={handleExport}
        queryText={queryText}
      />
    </Card>
  );
};