import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import SqlEditor from "@/components/datasets/SqlEditor";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import { VirtualizedTable } from "./VirtualizedTable";
import type { ColumnDef } from "@tanstack/react-table";

interface DatasetQueryProps {
  selectedDataset?: string | null;
  selectedColumns?: string[];
}

export const DatasetQuery = ({ selectedDataset, selectedColumns = [] }: DatasetQueryProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);

  const handleExecuteQuery = async (query: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) throw error;

      const results = data as any[];
      setQueryResults(results);
      
      // Generate columns dynamically from the first result
      if (results.length > 0) {
        const cols: ColumnDef<any>[] = Object.keys(results[0]).map(key => ({
          accessorKey: key,
          header: key,
          cell: info => String(info.getValue() ?? ''),
        }));
        setColumns(cols);
      }
      
      toast({
        title: "Query executed successfully",
        description: `Retrieved ${results.length} rows`
      });

      if (user?.id) {
        await supabase.from("analytics").insert({
          user_id: user.id,
          dataset_name: "custom_query",
          is_custom_query: true
        });
      }
    } catch (error: any) {
      console.error("Error executing query:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to execute query"
      });
      setQueryResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResults = () => {
    if (!queryResults?.length) return;

    try {
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
        description: "Query results downloaded successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download results"
      });
    }
  };

  const generateDefaultQuery = () => {
    if (!selectedDataset) return "";
    const columns = selectedColumns.length > 0 ? selectedColumns.join(', ') : '*';
    return `SELECT ${columns} FROM "${selectedDataset}" LIMIT 100`;
  };

  return (
    <Card className="p-6 space-y-6 metallic-card">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">SQL Query</h2>
          <p className="text-muted-foreground">
            Execute custom SQL queries on the available datasets
          </p>
        </div>
        {queryResults && queryResults.length > 0 && (
          <Button
            variant="outline"
            onClick={handleDownloadResults}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
        )}
      </div>

      {selectedDataset && (
        <div className="space-y-2">
          <Label>Selected Dataset</Label>
          <div className="p-2 bg-muted rounded-md">
            {selectedDataset}
          </div>
        </div>
      )}

      {selectedColumns.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Columns</Label>
          <div className="p-2 bg-muted rounded-md">
            {selectedColumns.join(", ")}
          </div>
        </div>
      )}

      <SqlEditor onExecute={handleExecuteQuery} defaultValue={generateDefaultQuery()} />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Executing query...</p>
        </div>
      ) : queryResults && queryResults.length > 0 ? (
        <div className="border rounded-md">
          <VirtualizedTable 
            data={queryResults} 
            columns={columns}
            isLoading={isLoading}
          />
        </div>
      ) : queryResults ? (
        <p className="text-center text-muted-foreground">No results found</p>
      ) : null}
    </Card>
  );
};