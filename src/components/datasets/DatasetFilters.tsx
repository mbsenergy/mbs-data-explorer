import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DatasetFiltersProps {
  onSearchChange: (search: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  onFavoriteChange: (showFavorites: boolean) => void;
  availableFields: string[];
  availableTypes: string[];
}

const DatasetFilters = ({ 
  onSearchChange, 
  onFieldChange, 
  onTypeChange,
  onFavoriteChange,
  availableFields,
  availableTypes,
}: DatasetFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search datasets..."
            className="pl-10"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select onValueChange={onFieldChange} defaultValue="all">
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
        <Select onValueChange={onTypeChange} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="favorite-filter" onCheckedChange={onFavoriteChange} />
        <Label htmlFor="favorite-filter">Show only favorites</Label>
      </div>
    </div>
  );
};

export default DatasetFilters;