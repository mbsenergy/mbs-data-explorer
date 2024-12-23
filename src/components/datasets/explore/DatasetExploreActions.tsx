import { Button } from "@/components/ui/button";
import { Download, Database, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DatasetExploreActionsProps {
  selectedDataset: string | null;
  onRetrieve: () => void;
  onExport: () => void;
  onShowQuery: () => void;
  isLoading?: boolean;
}

export const DatasetExploreActions = ({
  selectedDataset,
  onRetrieve,
  onExport,
  onShowQuery,
  isLoading
}: DatasetExploreActionsProps) => {
  const { toast } = useToast();

  const handleRetrieve = async () => {
    if (!selectedDataset) {
      toast({
        title: "No dataset selected",
        description: "Please select a dataset first",
        variant: "destructive"
      });
      return;
    }

    // Check row count
    const { data: countData, error: countError } = await supabase
      .rpc('get_table_row_count', { table_name: selectedDataset });
    
    if (countError) {
      toast({
        title: "Error",
        description: "Failed to check dataset size",
        variant: "destructive"
      });
      return;
    }
    
    if (countData > 200000) {
      toast({
        title: "Dataset too large",
        description: "Cannot retrieve datasets with more than 200,000 rows. Please use the export feature instead.",
        variant: "destructive"
      });
      return;
    }

    onRetrieve();
  };

  return (
    <div className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRetrieve}
        disabled={isLoading}
        className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
      >
        <Database className="h-4 w-4 mr-2" />
        Retrieve
      </Button>
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
  );
};