import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DatasetHeaderProps {
  selectedDataset: string | null;
  onLoad?: (tableName: string) => void;
  onSample?: (tableName: string) => void;
}

export const DatasetHeader = ({ selectedDataset, onLoad, onSample }: DatasetHeaderProps) => {
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
            onClick={() => onLoad(selectedDataset)}
            className="bg-[#4fd9e8] hover:bg-[#4fd9e8]/90 text-white"
          >
            Load
          </Button>
        )}
        {onSample && selectedDataset && (
          <Button 
            variant="outline"
            onClick={() => onSample(selectedDataset)}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Sample
          </Button>
        )}
      </div>
    </div>
  );
};