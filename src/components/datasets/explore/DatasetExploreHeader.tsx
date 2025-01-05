import { Button } from "@/components/ui/button";

interface DatasetExploreHeaderProps {
  selectedDataset: string | null;
  onLoad?: (tableName: string) => void;
}

export const DatasetExploreHeader = ({ selectedDataset, onLoad }: DatasetExploreHeaderProps) => {
  const handleLoad = () => {
    if (selectedDataset && onLoad) {
      onLoad(selectedDataset);
    }
  };

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
        {onLoad && (
          <Button 
            variant="outline"
            size="sm"
            onClick={handleLoad}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            Load
          </Button>
        )}
        <Button 
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '#sample'}
          className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
        >
          Sample
        </Button>
      </div>
    </div>
  );
};