import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ColumnTypeConfig, DataTypeOption } from "@/types/column-types";

const dataTypeOptions: DataTypeOption[] = [
  { 
    value: 'text', 
    label: 'Text',
    description: 'String values (default)'
  },
  { 
    value: 'number', 
    label: 'Number',
    description: 'Numeric values (integers or decimals)'
  },
  { 
    value: 'date', 
    label: 'Date',
    description: 'Date values (e.g., YYYY-MM-DD)'
  },
  { 
    value: 'boolean', 
    label: 'Boolean',
    description: 'True/False values'
  }
];

interface DataColumnTypeSelectProps {
  columns: ColumnTypeConfig[];
  onColumnTypeChange: (columnName: string, newType: string) => void;
}

export const DataColumnTypeSelect = ({ 
  columns,
  onColumnTypeChange
}: DataColumnTypeSelectProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Column Types</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select the appropriate data type for each column</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid gap-4">
        {columns.map((col) => (
          <div key={col.name} className="flex items-center gap-4">
            <span className="min-w-[200px] text-sm">{col.name}</span>
            <Select
              value={col.type}
              onValueChange={(value) => onColumnTypeChange(col.name, value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};