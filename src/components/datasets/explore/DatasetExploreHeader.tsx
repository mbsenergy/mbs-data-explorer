import { Button } from "@/components/ui/button";
import { Database, Download, Code } from "lucide-react";
import type { Database as SupabaseDatabase } from "@/integrations/supabase/types";

type TableNames = keyof SupabaseDatabase['public']['Tables'];

export interface DatasetExploreHeaderProps {
  selectedDataset: TableNames | null;
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
          <Database className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Explore</h2>
        </div>
        {selectedDataset && (
          <p className="text-muted-foreground">
            Selected dataset: <span className="font-medium">{String(selectedDataset)}</span>
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
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
          >
            <Database className="h-4 w-4 mr-2" />
            Retrieve
          </Button>
        )}
        <Button 
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isLoading}
          className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowQuery}
          disabled={isLoading}
          className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
        >
          <Code className="h-4 w-4 mr-2" />
          Show Query
        </Button>
      </div>
    </div>
  );
};