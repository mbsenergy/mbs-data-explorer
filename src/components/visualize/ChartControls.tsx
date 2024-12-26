import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChartControlsProps, ChartType, AggregationType } from "@/types/visualize";
import { BarChart, LineChart, ScatterChart, BoxSelect, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const chartTypes = [
  { value: "scatter", label: "Scatter", icon: ScatterChart, description: "Best for showing relationships between two variables" },
  { value: "bar", label: "Bar", icon: BarChart, description: "Ideal for comparing quantities across categories" },
  { value: "line", label: "Line", icon: LineChart, description: "Perfect for showing trends over time" },
  { value: "box", label: "Box", icon: BoxSelect, description: "Great for displaying data distribution" }
] as const;

const aggregationTypes = [
  { value: "none", label: "None", description: "Show raw data points" },
  { value: "sum", label: "Sum", description: "Calculate the total of values" },
  { value: "mean", label: "Mean", description: "Calculate the average" },
  { value: "max", label: "Max", description: "Show highest value" },
  { value: "min", label: "Min", description: "Show lowest value" }
] as const;

export const ChartControls = ({ columns, plotConfig, onConfigChange, onGenerateChart }: ChartControlsProps) => {
  const handleAxisChange = (axis: 'xAxis' | 'yAxis', value: string) => {
    onConfigChange({ ...plotConfig, [axis]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* X-Axis Selection */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Label className="font-semibold">X Axis</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the column for your X axis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <select 
            className="w-full rounded-md border bg-background px-3 py-2"
            value={plotConfig.xAxis}
            onChange={(e) => handleAxisChange('xAxis', e.target.value)}
          >
            <option value="">Select column</option>
            {columns.map(col => (
              <option key={col.id} value={col.id as string}>
                {String(col.header)}
              </option>
            ))}
          </select>
        </Card>

        {/* Y-Axis Selection */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Y Axis</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the column for your Y axis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={plotConfig.yAxis}
            onChange={(e) => handleAxisChange('yAxis', e.target.value)}
          >
            <option value="">Select column</option>
            {columns.map(col => (
              <option key={col.id} value={col.id as string}>
                {String(col.header)}
              </option>
            ))}
          </select>
        </Card>

        {/* Group By Selection */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Group By</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Optional: Group your data by a category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={plotConfig.groupBy}
            onChange={(e) => onConfigChange({ ...plotConfig, groupBy: e.target.value })}
          >
            <option value="">No grouping</option>
            {columns.map(col => (
              <option key={col.id} value={col.id as string}>
                {String(col.header)}
              </option>
            ))}
          </select>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-12 gap-6">
        {/* Chart Type Selection */}
        <div className="col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Chart Type</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the type of visualization</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {chartTypes.map(({ value, label, icon: Icon, description }) => (
              <TooltipProvider key={value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                        plotConfig.chartType === value 
                          ? "border-primary bg-primary/10" 
                          : "hover:border-primary/50"
                      )}
                      onClick={() => onConfigChange({ ...plotConfig, chartType: value as ChartType })}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Aggregation Selection */}
        <div className="col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Summarizing Function</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose how to aggregate your data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {aggregationTypes.map(({ value, label, description }) => (
              <TooltipProvider key={value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                        plotConfig.aggregation === value 
                          ? "border-primary bg-primary/10" 
                          : "hover:border-primary/50"
                      )}
                      onClick={() => onConfigChange({ ...plotConfig, aggregation: value as AggregationType })}
                    >
                      <span>{label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button
          onClick={onGenerateChart}
          disabled={!plotConfig.xAxis || !plotConfig.yAxis}
          className="bg-[#e11d48] hover:bg-[#be123c] text-white disabled:opacity-50"
        >
          Generate Chart
        </Button>
      </div>
    </div>
  );
};