import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ColumnDataType } from "@/types/columns";

interface DataColumnTypeSelectProps {
  columns: { name: string; type: ColumnDataType }[];
  onTypeChange: (columnName: string, type: ColumnDataType) => void;
}

export const DataColumnTypeSelect = ({ columns, onTypeChange }: DataColumnTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Column Types</Label>
      <div className="grid gap-4 md:grid-cols-2">
        {columns.map((col) => (
          <div key={col.name} className="flex items-center gap-2">
            <span className="min-w-[120px] text-sm">{col.name}</span>
            <Select
              value={col.type}
              onValueChange={(value: ColumnDataType) => onTypeChange(col.name, value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};