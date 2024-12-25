import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import SqlEditor from "@/components/datasets/SqlEditor";
import { DatasetQueryResults } from "./DatasetQueryResults";
import { DatasetSearch } from "../DatasetSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import type { TableInfo, ColumnDefWithAccessor } from "../types";
import type { Database } from "@/integrations/supabase/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type TableNames = keyof Database['public']['Tables'];

interface DatasetQueryProps {
  selectedDataset: TableNames | null;
  selectedColumns: string[];
}

export const DatasetQuery = ({
  selectedDataset: initialSelectedDataset,
  selectedColumns: initialSelectedColumns,
}) => {
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
  const [selectedDataset, setSelectedDataset] = useState<TableNames | null>(initialSelectedDataset);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  // Extract available fields (first two letters) and types (next two numbers) from table names
  const availableFields = React.useMemo(() => {
    if (!tables) return [];
    const fields = new Set<string>();
    tables.forEach(table => {
      const match = table.tablename.match(/^([A-Z]{2})/);
      if (match) {
        fields.add(match[1]);
      }
    });
    return Array.from(fields);
  }, [tables]);

  const availableTypes = React.useMemo(() => {
    if (!tables) return [];
    const types = new Set<string>();
    tables.forEach(table => {
      const match = table.tablename.match(/^[A-Z]{2}(\d{2})/);
      if (match) {
        types.add(match[1]);
      }
    });
    return Array.from(types);
  }, [tables]);

  const filteredTables = tables?.filter(table => {
    const matchesSearch = table.tablename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "all" || table.tablename.startsWith(selectedField);
    const matchesType = selectedType === "all" || table.tablename.match(new RegExp(`^[A-Z]{2}${selectedType}_`));
    const matchesFavorite = !showOnlyFavorites || favorites.has(table.tablename);
    return matchesSearch && matchesField && matchesType && matchesFavorite;
  });

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

  const handleSelect = (tableName: string) => {
    setSelectedDataset(tableName);
    setQuery(`SELECT * FROM ${tableName} LIMIT 100`);
    toast({
      title: "Query Generated",
      description: `Query for ${tableName} has been generated.`,
      style: { backgroundColor: "#22c55e", color: "white" }
    });
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
        const cols: ColumnDefWithAccessor[] = Object.keys(results[0]).map(key => ({
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

  return (
    <div className="space-y-6">
      <Card className="p-6 metallic-card">
        <Collapsible open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Datamart Search</h2>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isSearchOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Browse and select datasets to generate SQL queries
              </p>
              {tablesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p>Loading datasets...</p>
                </div>
              ) : (
                <DatasetSearch
                  tables={filteredTables || []}
                  onPreview={() => {}}
                  onDownload={() => {}}
                  onSelect={handleSelect}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
                  onSearchChange={setSearchTerm}
                  onFieldChange={setSelectedField}
                  onTypeChange={setSelectedType}
                  onFavoriteChange={setShowOnlyFavorites}
                  availableFields={availableFields}
                  availableTypes={availableTypes}
                  selectedDataset={selectedDataset || ""}
                />
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-6 metallic-card">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <h2 className="text-2xl font-semibold">SQL Query</h2>
          </div>
          <p className="text-muted-foreground">
            Execute custom SQL queries on the available datasets
          </p>
          <SqlEditor onExecute={handleExecuteQuery} defaultValue={query} />
        </div>
      </Card>

      <DatasetQueryResults
        isLoading={isLoading}
        queryResults={queryResults}
        columns={columns}
        onDownload={handleDownloadResults}
      />
    </div>
  );
};