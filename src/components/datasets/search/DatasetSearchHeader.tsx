import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileSearch } from "lucide-react";

interface DatasetSearchHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const DatasetSearchHeader = ({ isOpen, onToggle }: DatasetSearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
            <FileSearch className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Datamart Search</h2>
          </div>
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