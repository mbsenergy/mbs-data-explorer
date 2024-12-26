import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DataGrid } from "./DataGrid";
import { DatasetActionDialog } from "../explore/DatasetActionDialog";
import { DatasetQueryEmptyState } from "./DatasetQueryEmptyState";
import type { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DatasetQueryResultsProps {
  isLoading: boolean;
  queryResults: any[] | null;
  columns: ColumnDef<any>[];
  onDownload: () => void;
}

export const DatasetQueryResults = ({
  isLoading,
  queryResults,
  columns,
  onDownload
}: DatasetQueryResultsProps) => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleConfirmExport = () => {
    try {
      if (!queryResults || queryResults.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No data available to export",
        });
        return;
      }

      // Create CSV content
      const headers = Object.keys(queryResults[0]).join(',');
      const rows = queryResults.map(row => 
        Object.values(row).map(value => {
          if (value === null) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      // Create and trigger download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `query_results_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Query results exported successfully",
      });
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export data",
      });
    } finally {
      setShowExportDialog(false);
    }
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
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-md bg-card border border-border">
          <div className="text-sm text-muted-foreground">Number of Rows</div>
          <div className="text-lg font-semibold">{queryResults.length}</div>
        </div>
        <div className="p-3 rounded-md bg-card border border-border">
          <div className="text-sm text-muted-foreground">Number of Columns</div>
          <div className="text-lg font-semibold">{columns.length}</div>
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
      <div className="border rounded-md metallic-card h-[700px]">
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