import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { ColumnDef } from "@tanstack/react-table";
import { DatasetQueryResults } from "./DatasetQueryResults";
import { DatamartSearch } from "@/components/visualize/DatamartSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import type { TableInfo, TableNames } from "../types";
import { SqlQueryBox } from "../SqlQueryBox";
import { SavedQueries } from "../SavedQueries";
import { PreviewDialog } from "@/components/developer/PreviewDialog";

export const DatasetQuery = ({
  selectedDataset: initialSelectedDataset,
  selectedColumns: initialSelectedColumns,
}: {
  selectedDataset: TableNames | null;
  selectedColumns: string[];
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
  const [previewData, setPreviewData] = useState<{ tableName: string; data: string } | null>(null);

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const handleExecuteQuery = async (query: string) => {
    setIsLoading(true);
    setQueryResults(null);
    setColumns([]);

    try {
      // Show warning for potentially long-running queries
      if (!query.toLowerCase().includes('limit') || query.toLowerCase().includes('count(*)')) {
        toast({
          title: "Warning",
          description: "Large queries may take longer to execute. Consider adding a LIMIT clause.",
          variant: "default",
          className: "bg-yellow-500"
        });
      }

      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) {
        // Handle timeout errors specifically
        if (error.message.includes('57014') || error.message.includes('statement timeout')) {
          throw new Error(
            'Query timed out. Try these tips:\n' +
            '- Add a LIMIT clause\n' +
            '- Add more specific WHERE conditions\n' +
            '- Break down the query into smaller parts'
          );
        }
        throw error;
      }

      const results = Array.isArray(queryResult) ? queryResult : [];
      
      if (results.length > 0) {
        const cols: ColumnDef<any>[] = Object.keys(results[0]).map(key => ({
          id: key,
          header: key,
          accessorKey: key,
          cell: info => {
            const value = info.getValue();
            return value === null ? 'NULL' : String(value);
          },
        }));
        setColumns(cols);
        setQueryResults(results);
      } else {
        setColumns([]);
        setQueryResults([]);
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

  const handleTableSelect = async (tableName: string) => {
    setSelectedDataset(tableName as TableNames);
    setQuery(`SELECT * FROM "${tableName}" LIMIT 100`);
    toast({
      title: "Query Generated",
      description: `Query for ${tableName} has been generated.`,
      style: { backgroundColor: "#22c55e", color: "white" }
    });
  };

  const handlePreview = async (tableName: TableNames) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10);

      if (error) throw error;

      if (data) {
        setPreviewData({
          tableName,
          data: JSON.stringify(data, null, 2)
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to preview dataset"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (tableName: TableNames) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to download datasets.",
      });
      return;
    }

    try {
      const { error: analyticsError } = await supabase
        .from("analytics")
        .insert({
          user_id: user.id,
          dataset_name: tableName,
          is_custom_query: false,
        });

      if (analyticsError) {
        console.error("Error tracking download:", analyticsError);
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1000);

      if (error) throw error;

      if (!data || !data.length) {
        throw new Error("No data available for download");
      }

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
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
      a.download = `${tableName}_sample.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Dataset sample downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Error downloading dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to download dataset.",
      });
    }
  };

  const filteredTables = tables?.filter(table => {
    const matchesSearch = table.tablename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "all" || table.tablename.startsWith(selectedField);
    const matchesType = selectedType === "all" || table.tablename.match(new RegExp(`^[A-Z]{2}${selectedType}_`));
    const matchesFavorite = !showOnlyFavorites || favorites.has(table.tablename);
    return matchesSearch && matchesField && matchesType && matchesFavorite;
  });

  return (
    <div className="space-y-6">
      <DatamartSearch
        tables={tables || []}
        filteredTables={filteredTables || []}
        favorites={favorites}
        selectedDataset={selectedDataset}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onSelect={handleTableSelect}
        onToggleFavorite={toggleFavorite}
        onSearchChange={setSearchTerm}
        onFieldChange={setSelectedField}
        onTypeChange={setSelectedType}
        onFavoriteChange={setShowOnlyFavorites}
        availableFields={Array.from(new Set(tables?.map(t => t.tablename.slice(0, 2)) || []))}
        availableTypes={Array.from(new Set(tables?.map(t => t.tablename.slice(2, 4)) || []))}
      />

      <SavedQueries onSelectQuery={(queryText) => setQuery(queryText)} />

      <SqlQueryBox 
        onExecute={handleExecuteQuery} 
        defaultValue={query}
        isLoading={isLoading}
      />

      <DatasetQueryResults
        isLoading={isLoading}
        queryResults={queryResults}
        columns={columns}
        onDownload={() => {}}
      />

      {previewData && (
        <PreviewDialog
          isOpen={!!previewData}
          onClose={() => setPreviewData(null)}
          filePath=""
          fileName={previewData.tableName}
          section="datasets"
          directData={previewData.data}
        />
      )}
    </div>
  );
};