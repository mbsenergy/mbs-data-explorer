import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatasetDownload } from "./DatasetDownload";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetHeaderProps {
  selectedDataset: TableNames | null;
  selectedColumns: string[];
  selectedColumn: string;
  searchTerm: string;
  data: any[];
  onLoad?: (tableName: string) => void;
}

export const DatasetHeader = ({
  selectedDataset,
  selectedColumns,
  selectedColumn,
  searchTerm,
  data,
  onLoad
}: DatasetHeaderProps) => {
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
        {onLoad && selectedDataset && (
          <Button 
            onClick={handleLoad}
            variant="outline"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:text-accent-foreground h-9 rounded-md px-3 bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Retrieve
          </Button>
        )}
        <DatasetDownload
          selectedDataset={selectedDataset}
          selectedColumns={selectedColumns}
          selectedColumn={selectedColumn}
          searchTerm={searchTerm}
          data={data}
        />
      </div>
    </div>
  );
};