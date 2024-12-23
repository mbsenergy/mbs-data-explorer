import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetPagination } from "./DatasetPagination";
import { DatasetStats } from "./DatasetStats";
import { DatasetTable } from "./DatasetTable";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetFilters } from "./DatasetFilters";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import type { Filter } from "./types";
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
      // Reset filters application state when loading new data
      setShouldApplyFilters(false);
    }
  };

  const filterData = (data: any[]) => {
    if (!shouldApplyFilters) return data;

    return data.filter((item) =>
      filters.reduce((pass, filter, index) => {
        let matches = false;
        const value = filter.selectedColumn === "all_columns" || !filter.selectedColumn
          ? Object.entries(item)
              .filter(([key]) => !key.startsWith('md_'))
              .some(([_, value]) => 
                String(value).toLowerCase().includes(filter.searchTerm.toLowerCase())
              )
          : (() => {
              const itemValue = String(item[filter.selectedColumn]).toLowerCase();
              const filterValue = filter.searchTerm.toLowerCase();
              
              switch (filter.comparisonOperator) {
                case '=':
                  return itemValue === filterValue;
                case '>':
                  return Number(itemValue) > Number(filterValue);
                case '<':
                  return Number(itemValue) < Number(filterValue);
                case '>=':
                  return Number(itemValue) >= Number(filterValue);
                case '<=':
                  return Number(itemValue) <= Number(filterValue);
                case '!=':
                  return itemValue !== filterValue;
                case 'IN':
                  const values = filterValue.split(',').map(v => v.trim());
                  return values.includes(itemValue);
                case 'NOT IN':
                  const excludedValues = filterValue.split(',').map(v => v.trim());
                  return !excludedValues.includes(itemValue);
                default:
                  return itemValue.includes(filterValue);
              }
            })();

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
    const pageData = await fetchPage(newPage, itemsPerPage);
    if (pageData) {
      setCurrentPage(newPage);
    }
  };

  const handleApplyFilters = () => {
    setShouldApplyFilters(true);
  };

  const filteredData = filterData(data);

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
            data={filteredData.slice(
              currentPage * itemsPerPage,
              (currentPage + 1) * itemsPerPage
            )}
            selectedColumns={selectedColumns}
          />

          <DatasetPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
};