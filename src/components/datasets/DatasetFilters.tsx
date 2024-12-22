import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatasetFiltersProps {
  onSearchChange: (search: string) => void;
  onFieldChange: (field: string) => void;
  availableFields: string[];
}

const DatasetFilters = ({ onSearchChange, onFieldChange, availableFields }: DatasetFiltersProps) => {
  return (
    <div className="flex gap-4 items-center mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search datasets..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select onValueChange={onFieldChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a field" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All fields</SelectItem>
          {availableFields.map((field) => (
            <SelectItem key={field} value={field}>{field}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DatasetFilters;