import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { DatasetQueryResults } from "./DatasetQueryResults";
import { DatasetQueryEmptyState } from "./DatasetQueryEmptyState";
import { useQuery } from "@tanstack/react-query";
import type { TableInfo, TableNames } from "../types";
import { SqlQueryBox } from "../SqlQueryBox";
import { SavedQueries } from "../SavedQueries";
import { PreviewDialog } from "@/components/developer/PreviewDialog";
import { fetchDataInBatches } from "@/utils/batchProcessing";

interface DatasetQueryProps {
  selectedDataset?: TableNames | null;
  selectedColumns?: string[];
}

export const DatasetQuery = ({ selectedDataset, selectedColumns }: DatasetQueryProps) => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState("");
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
        <DatasetQueryResults 
          queryResults={results}
          columns={columns}
          isLoading={isLoading} 
        />
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
