import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { ColumnDef } from "@tanstack/react-table";
import { SqlQueryBox } from "@/components/datasets/SqlQueryBox";
import { fetchDataInBatches } from "@/utils/batchProcessing";

interface VisualizeSqlQueryProps {
  onDataReceived: (data: any[], columns: ColumnDef<any>[]) => void;
}

export const VisualizeSqlQuery = ({ onDataReceived }: VisualizeSqlQueryProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

      let results: any[] = [];
      
      if (useBatchProcessing) {
        const tableMatch = query.match(/FROM\s+["']?(\w+)["']?/i);
        if (!tableMatch) {
          throw new Error("Could not determine table name from query");
        }
        const tableName = tableMatch[1];
        
        results = await fetchDataInBatches(
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
          throw error;
        }

        results = Array.isArray(data) ? data : [];
      }

      // Generate columns with show property set to true by default
      if (results.length > 0) {
        const cols: ColumnDef<any>[] = Object.keys(results[0]).map(key => ({
          id: key,
          header: key,
          accessorKey: key,
          show: true // Add this property for column visibility
        }));
        
        console.log("Generated columns:", cols);
        console.log("Query results:", results);
        
        onDataReceived(results, cols);
      } else {
        onDataReceived([], []);
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
        title: "Query Error",
        description: error.message || "Failed to execute query"
      });
      onDataReceived([], []);
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
    <SqlQueryBox 
      onExecute={handleExecuteQuery} 
      defaultValue="SELECT * FROM your_table LIMIT 100" 
      isLoading={isLoading}
    />
  );
};