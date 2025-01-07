import { DatasetFilters } from "./DatasetFilters";
import { DatasetColumnSelect } from "./DatasetColumnSelect";
import { DatasetTable } from "./DatasetTable";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { Button } from "@/components/ui/button";
import { compareValues } from "@/utils/datasetUtils";
import type { Filter } from "./types";

interface DatasetExploreContentProps {
  columns: string[];
  selectedColumns: string[];
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  filteredData: any[];
  setFilteredData: (data: any[]) => void;
  onColumnSelect: (column: string) => void;
  data: any[];
  isQueryModalOpen: boolean;
  setIsQueryModalOpen: (isOpen: boolean) => void;
  selectedDataset: string | null;
}

export const DatasetExploreContent = ({
  columns,
  selectedColumns,
  filters,
  setFilters,
  filteredData,
  setFilteredData,
  onColumnSelect,
  data,
  isQueryModalOpen,
  setIsQueryModalOpen,
  selectedDataset
}: DatasetExploreContentProps) => {
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

  const handleApplyFilters = () => {
    const newFilteredData = applyFilters(data);
    setFilteredData(newFilteredData);
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

  return (
    <>
      <div className="space-y-4">
        <DatasetFilters
          columns={columns}
          filters={filters}
          onFilterChange={(filterId, field, value) => {
            setFilters(filters.map(f =>
              f.id === filterId
                ? { ...f, [field]: value }
                : f
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
            setFilters(filters.filter(f => f.id !== filterId));
          }}
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
        onColumnSelect={onColumnSelect}
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
  );
};