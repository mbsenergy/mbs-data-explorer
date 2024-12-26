import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileSearch, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import SqlEditor from "@/components/datasets/SqlEditor";
import type { ColumnDef } from "@tanstack/react-table";
import { DatasetQueryResults } from "./DatasetQueryResults";
import { DatasetSearch } from "../DatasetSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import type { TableInfo, TableNames } from "../types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SqlQueryBox } from "../SqlQueryBox";

interface DatasetQueryProps {
  selectedDataset: TableNames | null;
  selectedColumns: string[];
}

export const DatasetQuery = ({
  selectedDataset: initialSelectedDataset,
  selectedColumns: initialSelectedColumns,
}: DatasetQueryProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [query, setQuery] = useState("SELECT * FROM your_table LIMIT 100");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedDataset, setSelectedDataset] = useState<TableNames | null>(initialSelectedDataset as TableNames | null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const handleSelect = (tableName: string) => {
    setSelectedDataset(tableName as TableNames);
    setQuery(`SELECT * FROM "${tableName}" LIMIT 100`);
    toast({
      title: "Query Generated",
      description: `Query for ${tableName} has been generated.`,
      style: { backgroundColor: "#22c55e", color: "white" }
    });
  };

  const validateQuery = (query: string): { isValid: boolean; error?: string } => {
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

  const handleExecuteQuery = async (query: string) => {
    setIsLoading(true);
    try {
      const validation = validateQuery(query);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const { data, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) {
        const pgError = error.message.match(/Query execution failed: (.*)/);
        throw new Error(pgError ? pgError[1] : error.message);
      }

      const results = data as any[];
      setQueryResults(results);
      
      if (results.length > 0) {
        const cols: ColumnDef<any>[] = Object.keys(results[0]).map(key => ({
          accessorKey: key,
          header: key,
          cell: info => {
            const value = info.getValue();
            return value === null ? 'NULL' : String(value);
          },
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
        title: "Query Error",
        description: error.message || "Failed to execute query"
      });
      setQueryResults(null);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {tablesLoading ? (
          <div className="flex items-center justify-center h-32">
            <p>Loading datasets...</p>
          </div>
        ) : (
          <DatasetSearch
            tables={tables || []}
            onPreview={() => {}}
            onDownload={() => {}}
            onSelect={handleSelect}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
            onSearchChange={setSearchTerm}
            onFieldChange={setSelectedField}
            onTypeChange={setSelectedType}
            onFavoriteChange={setShowOnlyFavorites}
            availableFields={Array.from(new Set(tables?.map(t => t.tablename.slice(0, 2)) || []))}
            availableTypes={Array.from(new Set(tables?.map(t => t.tablename.slice(2, 4)) || []))}
            selectedDataset={selectedDataset as string || ""}
          />
        )}
      </div>

      <SqlQueryBox onExecute={handleExecuteQuery} defaultValue={query} />

      <DatasetQueryResults
        isLoading={isLoading}
        queryResults={queryResults}
        columns={columns}
        onDownload={() => {}}
      />
    </div>
  );
};
