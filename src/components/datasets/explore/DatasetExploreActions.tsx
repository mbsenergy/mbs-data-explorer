import { Button } from "@/components/ui/button";
import { Download, Database, Code } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DatasetActionDialog } from "./DatasetActionDialog";

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
  const [showRetrieveDialog, setShowRetrieveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleRetrieve = async () => {
    if (!selectedDataset) {
      toast({
        title: "No dataset selected",
        description: "Please select a dataset first",
        variant: "destructive"
      });
      return;
    }

    setShowRetrieveDialog(true);
  };

  const handleConfirmRetrieve = async () => {
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
    
    if (countData > 500000) {
      toast({
        title: "Dataset too large",
        description: "Cannot retrieve datasets with more than 500,000 rows. Please use the export feature instead.",
        variant: "destructive"
      });
      return;
    }

    onRetrieve();
    setShowRetrieveDialog(false);
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleConfirmExport = () => {
    onExport();
    setShowExportDialog(false);
  };

  return (
    <>
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
        onClick={handleExport}
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
    <DatasetActionDialog
      isOpen={showRetrieveDialog}
      onClose={() => setShowRetrieveDialog(false)}
      onConfirm={handleConfirmRetrieve}
      title="Retrieve Dataset"
      description="Are you sure you want to retrieve this dataset? This may take some time depending on the size of the data."
      actionLabel="Retrieve"
    />
    <DatasetActionDialog
      isOpen={showExportDialog}
      onClose={() => setShowExportDialog(false)}
      onConfirm={handleConfirmExport}
      title="Export Dataset"
      description="Are you sure you want to export this dataset?"
      actionLabel="Export"
    />
    </>
  );
};