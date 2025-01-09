import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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
    <Card className="p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="search">Search in data</Label>
          <Input
            id="search"
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="column">Filter by column</Label>
          <Select value={selectedColumn} onValueChange={onColumnChange}>
            <SelectTrigger id="column" className="w-full">
              <SelectValue placeholder="Select a column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All columns</SelectItem>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};