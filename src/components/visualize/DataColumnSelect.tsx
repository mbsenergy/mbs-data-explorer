import { Label } from "@/components/ui/label";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataPoint } from "@/types/visualize";

interface DataColumnSelectProps {
  columns: ColumnDef<DataPoint>[];
  selectedColumns: string[];
  onColumnSelect: (column: string) => void;
}

export const DataColumnSelect = ({ 
  columns, 
  selectedColumns, 
  onColumnSelect 
}: DataColumnSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Columns to display</Label>
      <div className="flex flex-wrap gap-2">
        {columns.map((col) => (
          <label
            key={String(col.id)}
            className="inline-flex items-center space-x-2 bg-card border border-border rounded-md px-3 py-1 cursor-pointer hover:bg-accent"
          >
            <input
              type="checkbox"
              checked={selectedColumns.includes(String(col.id))}
              onChange={() => onColumnSelect(String(col.id))}
              className="rounded border-gray-300"
            />
            <span>{String(col.header)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};