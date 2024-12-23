import { Label } from "@/components/ui/label";

interface DatasetColumnSelectProps {
  columns: string[];
  selectedColumns: string[];
  onColumnSelect: (column: string) => void;
}

export const DatasetColumnSelect = ({ 
  columns, 
  selectedColumns, 
  onColumnSelect 
}: DatasetColumnSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Columns to display</Label>
      <div className="flex flex-wrap gap-2">
        {columns.map((col) => (
          <label
            key={col}
            className="inline-flex items-center space-x-2 bg-card border border-border rounded-md px-3 py-1 cursor-pointer hover:bg-accent"
          >
            <input
              type="checkbox"
              checked={selectedColumns.includes(col)}
              onChange={() => onColumnSelect(col)}
              className="rounded border-gray-300"
            />
            <span>{col}</span>
          </label>
        ))}
      </div>
    </div>
  );
};