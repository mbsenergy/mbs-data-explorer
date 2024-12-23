import { Button } from "@/components/ui/button";
import { Download, ArrowDown } from "lucide-react";

interface DatasetHeaderProps {
  selectedDataset: string | null;
  onLoad?: (tableName: string) => void;
}

export const DatasetHeader = ({ selectedDataset, onLoad }: DatasetHeaderProps) => {
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
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white"
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Retrieve
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={() => window.location.href = '#sample'}
          className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
        >
          <Download className="h-4 w-4 mr-2" />
          Sample
        </Button>
      </div>
    </div>
  );
};