import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

interface DatasetExploreHeaderProps {
  selectedDataset: string | null;
  onLoad?: () => void;
  onExport: () => void;
  onShowQuery: () => void;
  isLoading: boolean;
}

export const DatasetExploreHeader = ({
  selectedDataset,
  onLoad,
  onExport,
  onShowQuery,
  isLoading
}: DatasetExploreHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Explore</h2>
        </div>
        {selectedDataset && (
          <p className="text-muted-foreground">
            Selected dataset: <span className="font-medium">{selectedDataset}</span>
          </p>
        )}
      </div>
      <div className="space-x-2">
        {onLoad && (
          <Button 
            variant="outline"
            size="sm"
            onClick={onLoad}
            disabled={isLoading}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            Load
          </Button>
        )}
        <Button 
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isLoading}
          className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
        >
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowQuery}
          disabled={isLoading}
          className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
        >
          Show Query
        </Button>
      </div>
    </div>
  );
};