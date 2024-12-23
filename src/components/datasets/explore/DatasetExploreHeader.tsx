import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DatasetExploreHeaderProps {
  selectedDataset: string | null;
  onLoad?: (tableName: string) => void;
  onSample?: (tableName: string) => void;
}

export const DatasetExploreHeader = ({ 
  selectedDataset, 
  onLoad,
  onSample
}: DatasetExploreHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Explore</h2>
        {selectedDataset && (
          <p className="text-muted-foreground">
            Selected dataset: <span className="font-medium">{selectedDataset}</span>
          </p>
        )}
      </div>
      <div className="space-x-2">
        {onLoad && selectedDataset && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onLoad(selectedDataset)}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            Load
          </Button>
        )}
        {onSample && selectedDataset && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSample(selectedDataset)}
            className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Sample
          </Button>
        )}
      </div>
    </div>
  );
};