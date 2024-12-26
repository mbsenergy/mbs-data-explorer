import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterControlsProps } from "@/types/visualize";
import { DatasetFilters } from "@/components/datasets/explore/DatasetFilters";

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
    <Card className="p-6 metallic-card">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
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
    </Card>
  );
};