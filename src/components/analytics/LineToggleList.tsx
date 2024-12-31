import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LineConfig } from "./types";

interface LineToggleListProps {
  lines: LineConfig[];
  onToggle: (lineId: string) => void;
}

export const LineToggleList = ({ lines, onToggle }: LineToggleListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {lines.map(line => (
        <div key={line.id} className="flex items-center space-x-2">
          <Checkbox
            id={line.id}
            checked={line.enabled}
            onCheckedChange={() => onToggle(line.id)}
          />
          <Label
            htmlFor={line.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {line.name}
          </Label>
        </div>
      ))}
    </div>
  );
};