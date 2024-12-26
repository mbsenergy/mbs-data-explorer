import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LegendPosition } from "@/types/visualize";

interface ChartOptionsProps {
  options: {
    showLegend: boolean;
    legendPosition: LegendPosition;
    enableZoom: boolean;
    enableAnimation: boolean;
    opacity: number;
    markerSize: number;
  };
  onChange: (key: string, value: any) => void;
}

export const ChartOptionsSelector = ({ options, onChange }: ChartOptionsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Chart Options</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Customize the appearance and behavior of your chart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Legend</Label>
            <div className="text-sm text-muted-foreground">
              Display chart legend
            </div>
          </div>
          <Switch
            checked={options.showLegend}
            onCheckedChange={(checked) => onChange('showLegend', checked)}
          />
        </div>

        {options.showLegend && (
          <div className="space-y-2">
            <Label>Legend Position</Label>
            <Select
              value={options.legendPosition}
              onValueChange={(value: LegendPosition) => onChange('legendPosition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Zoom</Label>
            <div className="text-sm text-muted-foreground">
              Allow zooming in the chart
            </div>
          </div>
          <Switch
            checked={options.enableZoom}
            onCheckedChange={(checked) => onChange('enableZoom', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Animation</Label>
            <div className="text-sm text-muted-foreground">
              Animate chart transitions
            </div>
          </div>
          <Switch
            checked={options.enableAnimation}
            onCheckedChange={(checked) => onChange('enableAnimation', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>Opacity</Label>
          <Slider
            value={[options.opacity]}
            onValueChange={([value]) => onChange('opacity', value)}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Marker Size</Label>
          <Slider
            value={[options.markerSize]}
            onValueChange={([value]) => onChange('markerSize', value)}
            min={1}
            max={20}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};