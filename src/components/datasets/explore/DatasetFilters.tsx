import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatasetFiltersProps {
  columns: string[];
  filters: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
}

export const DatasetFilters = ({ columns, filters, onFilterChange }: DatasetFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map(column => (
        <div key={column}>
          <Label>{column}</Label>
          <Input
            placeholder={`Filter by ${column}`}
            onChange={(e) => onFilterChange(column, e.target.value)}
            value={filters[column] || ''}
          />
        </div>
      ))}
    </div>
  );
};