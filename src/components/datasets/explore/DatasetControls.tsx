import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DatasetControlsProps {
  columns: string[];
  searchTerm: string;
  selectedColumn: string;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
  onLoad?: (tableName: string) => void;
  selectedDataset?: string;
}

export const DatasetControls = ({
  columns,
  searchTerm,
  selectedColumn,
  onSearchChange,
  onColumnChange,
  onLoad,
  selectedDataset,
}: DatasetControlsProps) => {
  return (
    <div className="space-y-6">
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
      
      {onLoad && selectedDataset && (
        <div className="flex gap-2">
          <Button
            onClick={() => onLoad(selectedDataset)}
            className="flex-1 bg-[#4fd9e8] hover:bg-[#4fd9e8]/90 text-white"
          >
            Load Dataset
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-[#F97316]/20 hover:bg-[#F97316]/30"
            onClick={() => onLoad(selectedDataset)}
          >
            Sample
          </Button>
        </div>
      )}
    </div>
  );
};