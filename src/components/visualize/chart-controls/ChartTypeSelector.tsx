import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChartType } from "@/types/visualize";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

const chartTypes = [
  { 
    value: "scatter", 
    label: "Scatter", 
    icon: "●",
    description: "Best for showing relationships between two variables" 
  },
  { 
    value: "bar", 
    label: "Bar", 
    icon: "▌",
    description: "Ideal for comparing quantities across categories" 
  },
  { 
    value: "line", 
    label: "Line", 
    icon: "━",
    description: "Perfect for showing trends over time" 
  },
  { 
    value: "box", 
    label: "Box", 
    icon: "☐",
    description: "Great for displaying data distribution" 
  },
  { 
    value: "area", 
    label: "Area", 
    icon: "▲",
    description: "Useful for showing cumulative totals over time" 
  },
  { 
    value: "bubble", 
    label: "Bubble", 
    icon: "⭘",
    description: "Shows three dimensions of data using size" 
  }
] as const;

export const ChartTypeSelector = ({ value, onChange }: ChartTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Chart Type</h3>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {chartTypes.map(({ value: type, label, icon, description }) => (
          <TooltipProvider key={type}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                    value === type 
                      ? "border-primary bg-primary/10" 
                      : "hover:border-primary/50"
                  )}
                  onClick={() => onChange(type)}
                >
                  <span className="text-lg">{icon}</span>
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
  );
};