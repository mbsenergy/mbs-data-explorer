import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetControlsProps {
  columns: string[];
  searchTerm: string;
  selectedColumn: string;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
  onLoad?: (tableName: string) => void;
  selectedDataset?: TableNames | null;
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
            variant="outline"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:text-accent-foreground h-9 rounded-md px-3 bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <ArrowDown className="h-4 w-4" />
            Retrieve
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
            onClick={() => window.location.href = '#sample'}
          >
            Sample
          </Button>
        </div>
      )}
    </div>
  );
};