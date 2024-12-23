import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface DatasetExportProps {
  selectedDataset: string | null;
  selectedColumns: string[];
  isLoading?: boolean;
}

export const DatasetExport = ({ selectedDataset, selectedColumns, isLoading }: DatasetExportProps) => {
  const { toast } = useToast();
  
  const handleExport = async () => {
    if (!selectedDataset || !selectedColumns.length) {
      toast({
        title: "Export failed",
        description: "Please select a dataset and at least one column to export.",
        variant: "destructive",
      });
      return;
    }

    // Export logic will be implemented here
    toast({
      title: "Export started",
      description: "Your export is being prepared. This may take a few moments.",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Export</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-muted-foreground">
            Export the selected columns from your dataset. The export will include all rows matching your current filters.
            For large datasets, the export will be processed in chunks to ensure reliable delivery.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Selected Dataset</Label>
          <div className="p-2 bg-muted rounded-md">
            {selectedDataset || "No dataset selected"}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Selected Columns</Label>
          <div className="p-2 bg-muted rounded-md min-h-[40px]">
            {selectedColumns.length > 0 
              ? selectedColumns.join(", ")
              : "No columns selected"}
          </div>
        </div>

        <Button 
          onClick={handleExport}
          className="w-full bg-[#F97316] hover:bg-[#F97316]/90 text-white"
          disabled={!selectedDataset || !selectedColumns.length || isLoading}
        >
          Export Dataset
        </Button>
      </div>
    </Card>
  );
};