import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetFilters } from "./DatasetFilters";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { DatasetExploreActions } from "./DatasetExploreActions";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Filter } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { Code } from "lucide-react";
import { Compass } from "lucide-react";

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
  const [filters, setFilters] = useState<Filter[]>([
    { 
      id: uuidv4(), 
      searchTerm: "", 
      selectedColumn: "", 
      operator: "AND",
      comparisonOperator: "=" 
    }
  ]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [pageSize] = useState(20);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData
  } = useDatasetData(selectedDataset);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  useEffect(() => {
    setFilteredData(data);
    setShouldApplyFilters(false);
  }, [data]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      // Call loadData with batch processing enabled
      await loadData(selectedDataset, selectedColumns, true);
      if (onLoad) {
        onLoad(selectedDataset);
      }
    }
  };

  const compareValues = (itemValue: any, filterValue: string, operator: string): boolean => {
    const normalizedItemValue = String(itemValue).toLowerCase();
    const normalizedFilterValue = filterValue.toLowerCase();

    switch (operator) {
      case '=':
        return normalizedItemValue === normalizedFilterValue;
      case '>':
        return Number(itemValue) > Number(filterValue);
      case '<':
        return Number(itemValue) < Number(filterValue);
      case '>=':
        return Number(itemValue) >= Number(filterValue);
      case '<=':
        return Number(itemValue) <= Number(filterValue);
      case '!=':
        return normalizedItemValue !== normalizedFilterValue;
      case 'IN':
        const inValues = filterValue.split(',').map(v => v.trim().toLowerCase());
        return inValues.includes(normalizedItemValue);
      case 'NOT IN':
        const notInValues = filterValue.split(',').map(v => v.trim().toLowerCase());
        return !notInValues.includes(normalizedItemValue);
      default:
        return normalizedItemValue.includes(normalizedFilterValue);
    }
  };

  const applyFilters = (dataToFilter: any[]) => {
    return dataToFilter.filter((item) =>
      filters.reduce((pass, filter, index) => {
        if (!filter.searchTerm || !filter.selectedColumn) {
          return index === 0 ? true : pass;
        }

        const itemValue = item[filter.selectedColumn];
        const matches = compareValues(itemValue, filter.searchTerm, filter.comparisonOperator);

        if (index === 0) return matches;
        return filter.operator === 'AND' ? pass && matches : pass || matches;
      }, false)
    );
  };

  const handleFilterChange = (
    filterId: string,
    field: keyof Filter,
    value: string
  ) => {
    setFilters(filters.map(f =>
      f.id === filterId
        ? { ...f, [field]: value }
        : f
    ));
  };

  const handleAddFilter = () => {
    setFilters([...filters, { 
      id: uuidv4(), 
      searchTerm: "", 
      selectedColumn: "", 
      operator: "AND",
      comparisonOperator: "=" 
    }]);
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const handleColumnSelect = (column: string) => {
    const newColumns = selectedColumns.includes(column)
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newColumns);
    onColumnsChange(newColumns);
  };

  const handlePageChange = async (newPage: number) => {
    const pageData = await fetchPage(newPage, pageSize);
    if (pageData) {
      setCurrentPage(newPage);
    }
  };

  const handleApplyFilters = () => {
    const newFilteredData = applyFilters(data);
    setFilteredData(newFilteredData);
    setShouldApplyFilters(true);
    setCurrentPage(0);
  };

  const handleSampleDownload = async () => {
    if (!selectedDataset || !user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a dataset and ensure you're logged in.",
      });
      return;
    }

    try {
      const dataToDownload = shouldApplyFilters ? filteredData : data;
      
      if (!dataToDownload || !dataToDownload.length) {
        throw new Error("No data available for download");
      }

      if (dataToDownload.length > 100000) {
        toast({
          variant: "destructive",
          title: "Too many rows",
          description: "Cannot export more than 500,000 rows. Please apply filters to reduce the dataset size."
        });
        return;
      }

      const { error: analyticsError } = await supabase
        .from("analytics")
        .insert({
          user_id: user.id,
          dataset_name: selectedDataset,
          is_custom_query: false,
        });

      if (analyticsError) {
        console.error("Error tracking download:", analyticsError);
      }

      const headers = selectedColumns.join(',');
      const rows = dataToDownload.map(row => 
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
      a.download = `${selectedDataset}_sample.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Dataset sample downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Error downloading dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to download dataset.",
      });
    }
  };

  const generateFilterQuery = () => {
    if (!selectedDataset) return "";
    
    let query = `SELECT ${selectedColumns.map(col => `"${col}"`).join(', ')} FROM "${selectedDataset}"`;
    
    if (filters.length > 0) {
      const filterConditions = filters
        .filter(f => f.searchTerm && f.selectedColumn)
        .map((filter, index) => {
          const comparison = filter.comparisonOperator;
          let condition = "";
          
          if (comparison === 'IN' || comparison === 'NOT IN') {
            const values = filter.searchTerm.split(',').map(v => `'${v.trim()}'`).join(',');
            condition = `"${filter.selectedColumn}" ${comparison} (${values})`;
          } else {
            condition = `"${filter.selectedColumn}" ${comparison} '${filter.searchTerm}'`;
          }
          
          return index === 0 ? condition : `${filter.operator} ${condition}`;
        });
      
      if (filterConditions.length > 0) {
        query += ` WHERE ${filterConditions.join(' ')}`;
      }
    }
    
    return query;
  };

  const handleShowQuery = () => {
    const query = generateFilterQuery();
    const apiCall = `await supabase
  .from('${selectedDataset}')
  .select('${selectedColumns.map(col => `"${col}"`).join(', ')}')`
    + (filters.length > 0 ? "\n  // Filters would need to be applied in JavaScript" : "");

    setIsQueryModalOpen(true);
  };

  return (
    <Card className="p-6 space-y-6 metallic-card">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
        <div className="flex items-center gap-2">
            <Compass className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Explore</h2>
          </div>
          {selectedDataset && (
            <p className="text-muted-foreground">
              Selected dataset: <span className="font-medium">{selectedDataset}</span>
            </p>
          )}
        </div>
        <DatasetExploreActions
          selectedDataset={selectedDataset}
          onRetrieve={handleLoad}
          onExport={handleSampleDownload}
          onShowQuery={() => setIsQueryModalOpen(true)}
          isLoading={isLoading}
        />
      </div>
      
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data[0]?.md_last_update || null}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <DatasetFilters
              columns={columns}
              filters={filters}
              onFilterChange={handleFilterChange}
              onAddFilter={handleAddFilter}
              onRemoveFilter={handleRemoveFilter}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleApplyFilters}
                variant="default"
                className="bg-[#4fd9e8] hover:bg-[#4fd9e8]/90 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>

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
            query={generateFilterQuery()}
            apiCall={`await supabase
  .from('${selectedDataset}')
  .select('${selectedColumns.join(', ')}')`
    + (filters.length > 0 ? "\n  // Filters would need to be applied in JavaScript" : "")}
          />
        </>
      )}
    </Card>
  );
};
