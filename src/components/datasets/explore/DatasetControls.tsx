import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatasetControlsProps {
  columns: string[];
  searchTerm: string;
  selectedColumn: string;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
}

export const DatasetControls = ({
  columns,
  searchTerm,
  selectedColumn,
  onSearchChange,
  onColumnChange,
}: DatasetControlsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search in data..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="column">Column</Label>
        <select
          id="column"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={selectedColumn}
          onChange={(e) => onColumnChange(e.target.value)}
        >
          <option value="">All columns</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};