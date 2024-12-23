import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetPagination } from "./DatasetPagination";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetFilters, Filter } from "./DatasetFilters";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { v4 as uuidv4 } from 'uuid';

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
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filter[]>([
    { id: uuidv4(), searchTerm: "", selectedColumn: "", operator: "AND" }
  ]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

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

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData(selectedDataset);
      if (onLoad) {
        onLoad(selectedDataset);
      }
    }
  };

  const filterData = (data: any[]) => {
    return data.filter((item) =>
      filters.reduce((pass, filter, index) => {
        const matches = filter.selectedColumn === "all_columns" || !filter.selectedColumn
          ? Object.entries(item)
              .filter(([key]) => !key.startsWith('md_'))
              .some(([_, value]) => 
                String(value).toLowerCase().includes(filter.searchTerm.toLowerCase())
              )
          : String(item[filter.selectedColumn])
              .toLowerCase()
              .includes(filter.searchTerm.toLowerCase());

        // First filter doesn't use operator
        if (index === 0) return matches;
        
        // Apply AND/OR logic for subsequent filters
        return filter.operator === 'AND' 
          ? pass && matches 
          : pass || matches;
      }, false)
    );
  };

  const handleFilterChange = (
    filterId: string,
    field: "searchTerm" | "selectedColumn" | "operator",
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
      operator: "AND" 
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
    const pageData = await fetchPage(newPage, itemsPerPage);
    if (pageData) {
      setCurrentPage(newPage);
    }
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
        <div className="space-x-2">
          {onLoad && (
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLoad}
              className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
            >
              Load
            </Button>
          )}
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '#sample'}
            className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
          >
            Sample
          </Button>
        </div>
      </div>
      
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filterData(data).length}
        lastUpdate={data[0]?.md_last_update || null}
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
            onFilterChange={handleFilterChange}
            onAddFilter={handleAddFilter}
            onRemoveFilter={handleRemoveFilter}
          />

          <DatasetColumnSelect
            columns={columns}
            selectedColumns={selectedColumns}
            onColumnSelect={handleColumnSelect}
          />

          <DatasetTable
            columns={columns}
            data={filterData(data).slice(
              currentPage * itemsPerPage,
              (currentPage + 1) * itemsPerPage
            )}
            selectedColumns={selectedColumns}
          />

          <DatasetPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filterData(data).length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
};
