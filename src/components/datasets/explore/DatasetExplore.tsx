import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatasetStats } from "./DatasetStats";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useExploreState } from "@/hooks/useExploreState";
import { DatasetExploreContent } from "./DatasetExploreContent";
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const itemsPerPage = 10;

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
    fetchPage,
    queryText
  } = useDatasetData(selectedDataset);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange, setSelectedColumns]);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Setting filtered data:", data);
      setFilteredData(data);
      const start = currentPage * itemsPerPage;
      const end = start + itemsPerPage;
      setPaginatedData(data.slice(start, end));
    }
  }, [data, currentPage, setFilteredData]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      try {
        // Build the query based on filters
        const filterConditions = filters
          .filter(f => f.selectedColumn && f.searchTerm)
          .map(f => {
            const value = isNaN(Number(f.searchTerm)) 
              ? `'${f.searchTerm}'` 
              : f.searchTerm;
            return `${f.selectedColumn} ${f.comparisonOperator} ${value}`;
          })
          .join(' AND ');

        // Pass the filter conditions to loadData
        await loadData(filterConditions);
        
        if (onLoad) {
          onLoad(selectedDataset);
        }
        
        toast({
          title: "Dataset Retrieved",
          description: `Successfully loaded ${selectedDataset} with filters`
        });
      } catch (error: any) {
        console.error("Error loading dataset:", error);
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
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data[0]?.md_last_update || null}
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
        paginatedData={paginatedData}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        onPageChange={handlePageChange}
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
        data={data}
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