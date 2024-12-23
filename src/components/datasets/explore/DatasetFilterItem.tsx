import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DatasetFilterItemProps {
  columns: string[];
  searchTerm: string;
  selectedColumn: string;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
  onRemove: () => void;
  showRemove?: boolean;
}

export const DatasetFilterItem = ({
  columns,
  searchTerm,
  selectedColumn,
  onSearchChange,
  onColumnChange,
  onRemove,
  showRemove = true
}: DatasetFilterItemProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search in data..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select 
        value={selectedColumn || "all_columns"} 
        onValueChange={onColumnChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a column" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_columns">All columns</SelectItem>
          {columns.map((col) => (
            <SelectItem key={col} value={col}>{col}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showRemove && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};