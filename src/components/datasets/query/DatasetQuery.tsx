import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { ColumnDef } from "@tanstack/react-table";
import { SqlQueryBox } from "@/components/datasets/SqlQueryBox";
import { DatasetQueryResults } from "./DatasetQueryResults";
import { DatasetQueryEmptyState } from "./DatasetQueryEmptyState";
import { useQuery } from "@tanstack/react-query";
import type { TableInfo, TableNames } from "../types";
import { SavedQueries } from "../SavedQueries";
import { PreviewDialog } from "@/components/developer/PreviewDialog";
import { fetchDataInBatches } from "@/utils/batchProcessing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Table } from "lucide-react";
import { PivotGrid } from "@/components/visualize/pivot/PivotGrid";

interface DatasetQueryProps {
  selectedDataset?: TableNames | null;
  selectedColumns?: string[];
}

export const DatasetQuery = ({ selectedDataset, selectedColumns }: DatasetQueryProps) => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [queryColumns, setQueryColumns] = useState<ColumnDef<any>[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const handleExecuteQuery = async (query: string, useBatchProcessing: boolean) => {
    setIsLoading(true);
    try {
      const validation = validateQuery(query);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      if (query.toLowerCase().includes('count(*)') || !query.toLowerCase().includes('limit')) {
        toast({
          title: "Warning",
          description: "Large queries may take longer to execute. Consider adding a LIMIT clause.",
          variant: "default",
          className: "bg-yellow-500"
        });
      }

      let queryResults: any[] = [];
      
      if (useBatchProcessing) {
        const tableMatch = query.match(/FROM\s+["']?(\w+)["']?/i);
        if (!tableMatch) {
          throw new Error("Could not determine table name from query");
        }
        const tableName = tableMatch[1];
        
        queryResults = await fetchDataInBatches(
          tableName,
          [],
          (progress) => {
            if (progress % 20 === 0) {
              toast({
                title: "Loading data",
                description: `${progress}% complete`
              });
            }
          }
        );
      } else {
        const { data, error } = await supabase.rpc('execute_query', {
          query_text: query
        });

        if (error) {
          if (error.message.includes('statement timeout') || error.message.includes('57014')) {
            throw new Error(
              'Query timed out. Try adding filters or LIMIT clause to reduce the result set.'
            );
          }
          throw new Error(error.message);
        }

        queryResults = Array.isArray(data) ? data : [];
      }

      // Generate columns from the first result
      if (queryResults.length > 0) {
        const cols: ColumnDef<any>[] = Object.keys(queryResults[0]).map(key => ({
          id: key,
          header: key,
          accessorKey: key,
        }));
        setQueryColumns(cols);
      }

      setResults(queryResults);
      
      toast({
        title: "Query executed successfully",
        description: `Retrieved ${queryResults.length} rows`
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
        title: "Query Error",
        description: error.message || "Failed to execute query"
      });
      setResults([]);
      setQueryColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateQuery = (query: string): { isValid: boolean; error?: string } => {
    if (!query.trim()) {
      return { 
        isValid: false, 
        error: "Query cannot be empty" 
      };
    }

    const disallowedKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE'];
    const hasDisallowedKeywords = disallowedKeywords.some(keyword => 
      query.toUpperCase().includes(keyword)
    );
    
    if (hasDisallowedKeywords) {
      return { 
        isValid: false, 
        error: "Only SELECT queries are allowed" 
      };
    }

    if (!query.trim().toUpperCase().startsWith('SELECT')) {
      return { 
        isValid: false, 
        error: "Query must start with SELECT" 
      };
    }

    return { isValid: true };
  };

  return (
    <div className="space-y-6">
      <SavedQueries
        onSelectQuery={(query) => {
          setSelectedQuery(query);
          setShowPreview(true);
        }}
      />
      
      <SqlQueryBox
        onExecute={handleExecuteQuery}
        defaultValue="SELECT * FROM your_table LIMIT 100"
        isLoading={isLoading}
      />

      {results.length > 0 ? (
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="pivot" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Pivot
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <DatasetQueryResults
              queryResults={results}
              columns={queryColumns}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="pivot">
            <PivotGrid
              data={results}
              columns={queryColumns}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <DatasetQueryEmptyState />
      )}

      <PreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        directData={selectedQuery}
        fileName="Query Preview"
      />
    </div>
  );
};