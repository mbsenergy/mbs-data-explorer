import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExportProps {
  selectedDataset: TableNames | null;
  selectedColumns: string[];
}

export const DatasetExport = ({ selectedDataset, selectedColumns }: DatasetExportProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Export Dataset</h2>
        <Button
          variant="outline"
          size="sm"
          disabled={!selectedDataset || selectedColumns.length === 0}
          className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Selected Dataset</h3>
          <p className="text-muted-foreground">
            {selectedDataset || "No dataset selected"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Selected Columns</h3>
          {selectedColumns.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {selectedColumns.map((column) => (
                <li key={column}>{column}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No columns selected</p>
          )}
        </div>
      </div>
    </Card>
  );
};