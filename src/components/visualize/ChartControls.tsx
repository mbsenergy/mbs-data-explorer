import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChartControlsProps, ChartType, AggregationType } from "@/types/visualize";
import { BarChart, LineChart, ScatterChart, BoxSelect } from "lucide-react";
import { Button } from "@/components/ui/button";

const chartTypes = [
  { value: "scatter", label: "Scatter", icon: ScatterChart },
  { value: "bar", label: "Bar", icon: BarChart },
  { value: "line", label: "Line", icon: LineChart },
  { value: "box", label: "Box", icon: BoxSelect }
] as const;

export const ChartControls = ({ columns, plotConfig, onConfigChange, onGenerateChart }: ChartControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>X Axis</Label>
          <select 
            className="w-full rounded-md border bg-background px-3 py-2"
            value={plotConfig.xAxis}
            onChange={(e) => onConfigChange({ ...plotConfig, xAxis: e.target.value })}
          >
            <option value="">Select column</option>
            {columns.map(col => (
              <option key={col.id} value={col.id as string}>
                {String(col.header)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Y Axis</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={plotConfig.yAxis}
            onChange={(e) => onConfigChange({ ...plotConfig, yAxis: e.target.value })}
          >
            <option value="">Select column</option>
            {columns.map(col => (
              <option key={col.id} value={col.id as string}>
                {String(col.header)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Group By</Label>
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
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6 space-y-2">
          <Label>Chart Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes.map(({ value, label, icon: Icon }) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroup
                  value={plotConfig.chartType}
                  onValueChange={(value) => onConfigChange({ ...plotConfig, chartType: value as ChartType })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`chart-${value}`} />
                    <Label htmlFor={`chart-${value}`} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-6 space-y-2">
          <Label>Summarizing Function</Label>
          <RadioGroup
            value={plotConfig.aggregation}
            onValueChange={(value) => onConfigChange({ ...plotConfig, aggregation: value as AggregationType })}
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="agg-none" />
                <Label htmlFor="agg-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sum" id="agg-sum" />
                <Label htmlFor="agg-sum">Sum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mean" id="agg-mean" />
                <Label htmlFor="agg-mean">Mean</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="max" id="agg-max" />
                <Label htmlFor="agg-max">Max</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="min" id="agg-min" />
                <Label htmlFor="agg-min">Min</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
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