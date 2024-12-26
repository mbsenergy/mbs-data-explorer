import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface DatasetFiltersProps {
  onSearchChange: (search: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  onFavoriteChange: (showFavorites: boolean) => void;
  availableFields?: string[];
  availableTypes?: string[];
}

const DatasetFilters = ({
  onSearchChange,
  onFieldChange,
  onTypeChange,
  onFavoriteChange,
  availableFields = ["EC", "ME", "MS", "TS"],
  availableTypes = ["01", "02", "03"]
}: DatasetFiltersProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search datasets..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Field</Label>
          <Select onValueChange={onFieldChange} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              {availableFields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type</Label>
          <Select onValueChange={onTypeChange} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {availableTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="favorites" onCheckedChange={onFavoriteChange} />
        <Label htmlFor="favorites">Show only favorites</Label>
      </div>
    </div>
  );
};

export default DatasetFilters;