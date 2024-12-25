import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DataGrid } from "./DataGrid";
import { DatasetActionDialog } from "../explore/DatasetActionDialog";
import { DatasetQueryEmptyState } from "./DatasetQueryEmptyState";
import type { ColumnDefWithAccessor } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DatasetQueryResultsProps {
  isLoading: boolean;
  queryResults: any[] | null;
  columns: ColumnDefWithAccessor[];
  onDownload: () => void;
}

export const DatasetQueryResults = ({
  isLoading,
  queryResults,
  columns,
  onDownload
}: DatasetQueryResultsProps) => {
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleConfirmExport = () => {
    onDownload();
    setShowExportDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p>Executing query...</p>
      </div>
    );
  }

  if (!queryResults) {
    return <DatasetQueryEmptyState />;
  }

  if (queryResults.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No results found</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 metallic-card">
        <div className="p-4 rounded-md bg-muted/50 border border-border">
          <div className="text-sm text-muted-foreground">Number of Rows</div>
          <div className="text-2xl font-semibold">{queryResults.length}</div>
        </div>
        <div className="p-4 rounded-md bg-muted/50 border border-border">
          <div className="text-sm text-muted-foreground">Number of Columns</div>
          <div className="text-2xl font-semibold">{columns.length}</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleExport}
          className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="border rounded-md metallic-card">
        <DataGrid
          data={queryResults}
          columns={columns}
          isLoading={isLoading}
        />
      </div>
      <DatasetActionDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onConfirm={handleConfirmExport}
        title="Export Query Results"
        description="Are you sure you want to export these query results?"
        actionLabel="Export"
      />
    </div>
  );
};