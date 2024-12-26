import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetFilters } from "@/components/datasets/explore/DatasetFilters";
import type { Filter, ComparisonOperator } from "@/components/datasets/explore/types";

interface FilterControlsProps {
  columns: string[];
  filters: Filter[];
  onFilterChange: (filterId: string, field: keyof Filter, value: string | ComparisonOperator) => void;
  onAddFilter: () => void;
  onRemoveFilter: (filterId: string) => void;
  onApplyFilters: () => void;
  originalCount: number;
  filteredCount: number;
}

export const FilterControls = ({
  columns,
  filters,
  onFilterChange,
  onAddFilter,
  onRemoveFilter,
  onApplyFilters,
  originalCount,
  filteredCount
}: FilterControlsProps) => {
  return (
    <div>
      <DatasetFilters
        columns={columns}
        filters={filters}
        onFilterChange={onFilterChange}
        onAddFilter={onAddFilter}
        onRemoveFilter={onRemoveFilter}
      />
      <div className="flex justify-end mt-4">
        <Button onClick={onApplyFilters} className="bg-[#4fd9e8] hover:bg-[#4fd9e8]/90 text-white">
          Apply Filters
        </Button>
      </div>
      <div className="mt-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-md border border-border">
            <div className="text-sm text-muted-foreground">Original Data Rows</div>
            <div className="text-2xl font-semibold">{originalCount.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-md border border-border">
            <div className="text-sm text-muted-foreground">Filtered Data Rows</div>
            <div className="text-2xl font-semibold">{filteredCount.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};