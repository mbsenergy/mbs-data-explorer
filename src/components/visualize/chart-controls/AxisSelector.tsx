import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { DataPoint } from "@/types/visualize";

interface AxisSelectorProps {
  columns: ColumnDef<DataPoint>[];
  config: {
    xAxis: string;
    yAxis: string;
    groupBy: string;
    xAxisLabel: string;
    yAxisLabel: string;
    reverseAxis: boolean;
    logScale: boolean;
  };
  onChange: (key: string, value: any) => void;
}

export const AxisSelector = ({ columns, config, onChange }: AxisSelectorProps) => {
  // Only show columns that are marked as visible (show === true)
  const visibleColumns = columns.filter(col => (col as any).show);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Axis Configuration</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure the chart axes and grouping</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>X Axis</Label>
          <Select
            value={config.xAxis}
            onValueChange={(value) => onChange('xAxis', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {visibleColumns.map(col => (
                <SelectItem key={String(col.id)} value={String(col.id)}>
                  {String(col.header)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="X Axis Label"
            value={config.xAxisLabel}
            onChange={(e) => onChange('xAxisLabel', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Y Axis</Label>
          <Select
            value={config.yAxis}
            onValueChange={(value) => onChange('yAxis', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {visibleColumns.map(col => (
                <SelectItem key={String(col.id)} value={String(col.id)}>
                  {String(col.header)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Y Axis Label"
            value={config.yAxisLabel}
            onChange={(e) => onChange('yAxisLabel', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Group By</Label>
          <Select
            value={config.groupBy}
            onValueChange={(value) => onChange('groupBy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No grouping</SelectItem>
              {visibleColumns.map(col => (
                <SelectItem key={String(col.id)} value={String(col.id)}>
                  {String(col.header)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Reverse Axis</Label>
            <div className="text-sm text-muted-foreground">
              Swap X and Y axes
            </div>
          </div>
          <Switch
            checked={config.reverseAxis}
            onCheckedChange={(checked) => onChange('reverseAxis', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Logarithmic Scale</Label>
            <div className="text-sm text-muted-foreground">
              Use log scale for numerical axes
            </div>
          </div>
          <Switch
            checked={config.logScale}
            onCheckedChange={(checked) => onChange('logScale', checked)}
          />
        </div>
      </div>
    </div>
  );
};