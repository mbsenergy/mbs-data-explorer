import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatasetFiltersProps {
  columns: string[];
  filters: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
}

const DatasetFilters = ({ columns, filters, onFilterChange }: DatasetFiltersProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Filters</h3>
      <div className="grid gap-4">
        {columns.map((column) => (
          <div key={column} className="grid gap-2">
            <Label>{column}</Label>
            <Input
              placeholder={`Filter by ${column}...`}
              value={filters[column] || ""}
              onChange={(e) => onFilterChange(column, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatasetFilters;