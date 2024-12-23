import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatasetFilterItem } from "./DatasetFilterItem";

export interface Filter {
  id: string;
  searchTerm: string;
  selectedColumn: string;
}

interface DatasetFiltersProps {
  columns: string[];
  filters: Filter[];
  onFilterChange: (filterId: string, field: "searchTerm" | "selectedColumn", value: string) => void;
  onAddFilter: () => void;
  onRemoveFilter: (filterId: string) => void;
}

export const DatasetFilters = ({
  columns,
  filters,
  onFilterChange,
  onAddFilter,
  onRemoveFilter
}: DatasetFiltersProps) => {
  return (
    <div className="space-y-4">
      {filters.map((filter, index) => (
        <DatasetFilterItem
          key={filter.id}
          columns={columns}
          searchTerm={filter.searchTerm}
          selectedColumn={filter.selectedColumn}
          onSearchChange={(value) => onFilterChange(filter.id, "searchTerm", value)}
          onColumnChange={(value) => onFilterChange(filter.id, "selectedColumn", value)}
          onRemove={() => onRemoveFilter(filter.id)}
          showRemove={filters.length > 1}
        />
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onAddFilter}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Filter
      </Button>
    </div>
  );
};