import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { VirtualizedTable } from "./VirtualizedTable";
import { DatasetQueryEmptyState } from "./DatasetQueryEmptyState";
import type { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";

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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onDownload}
          className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Results
        </Button>
      </div>
      <div className="border rounded-md">
        <VirtualizedTable 
          data={queryResults} 
          columns={columns}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};