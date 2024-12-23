import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DatasetSearchHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const DatasetSearchHeader = ({ isOpen, onToggle }: DatasetSearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold">Search on datamart</h2>
      <Button variant="ghost" size="sm" onClick={onToggle}>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};