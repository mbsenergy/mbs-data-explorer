import { AlertCircle } from "lucide-react";

export const DatasetQueryEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-2">
      <AlertCircle className="h-8 w-8" />
      <p>No query results to display</p>
      <p className="text-sm">Execute a query to see the results here</p>
    </div>
  );
};