import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { DatasetActions } from "@/components/datasets/DatasetActions";
import { DatasetQuery } from "@/components/datasets/query/DatasetQuery";
import { useFavorites } from "@/hooks/useFavorites";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import type { TableInfo } from "@/components/datasets/types";
import type { Database as SupabaseDatabase } from "@/integrations/supabase/types";

type TableNames = keyof SupabaseDatabase['public']['Tables'];

const Datasets = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<{ tableName: string; data: string } | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<TableNames | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const { favorites, toggleFavorite } = useFavorites();

  // Feature access checks
  const { isEnabled: canQuery } = useFeatureAccess("query");
  const { isEnabled: canSearch } = useFeatureAccess("datamart_search");

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const handleLoad = async (tableName: string) => {
    try {
      const { data: countData, error: countError } = await supabase
        .rpc('get_table_row_count', { table_name: tableName });
      
      if (countError) throw countError;
      
      if (countData > 100000) {
        toast({
          variant: "destructive",
          title: "Dataset too large",
          description: "Cannot load datasets with more than 100,000 rows. Please use the sample feature instead."
        });
        return;
      }

      const { data, error } = await supabase
        .from(tableName as TableNames)
        .select("*");

      if (error) throw error;

      if (data) {
        toast({
          title: "Dataset Loaded",
          description: `${tableName} has been loaded successfully with ${data.length} rows.`
        });
      }
    } catch (error: any) {
      console.error("Error loading dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load dataset."
      });
    }
  };

  const handlePreview = async (tableName: string) => {
    try {
      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: `SELECT * FROM "${tableName}" LIMIT 30`
      });

      if (error) {
        throw error;
      }

      if (queryResult && Array.isArray(queryResult)) {
        const previewRows = queryResult.slice(0, 30);
        setPreviewData({
          tableName,
          data: JSON.stringify(previewRows, null, 2)
        });
      }
    } catch (error: any) {
      console.error("Error previewing dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to preview dataset."
      });
    }
  };

  const handleDownload = async (tableName: string) => {
    if (!user?.id || !selectedColumns.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one column to download.",
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
        .from(tableName as TableNames)
        .select(selectedColumns.join(','))
        .limit(1000);

      if (error) {
        throw error;
      }

      if (!data || !data.length) {
        throw new Error("No data available for download");
      }

      const headers = selectedColumns.join(',');
      const rows = data.map(row => 
        selectedColumns.map(col => {
          const value = row[col];
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

  if (tablesLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Datasets</h1>
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (!canSearch) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
          Datasets
        </h1>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Feature Not Available</h2>
          <p className="text-muted-foreground">
            The Datamart Search feature is only available for Plus and Premium users.
            Please upgrade your account to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
        Datasets
      </h1>
      
      <Tabs defaultValue={searchParams.get("tab") || "explore"} className="space-y-6">
        <TabsList>
          <TabsTrigger value="explore" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Explore
          </TabsTrigger>
          {canQuery && (
            <TabsTrigger value="query" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Query
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="explore">
          <DatasetActions
            tables={tables || []}
            filteredTables={filteredTables || []}
            favorites={favorites}
            selectedDataset={selectedDataset}
            selectedColumns={selectedColumns}
            previewData={previewData}
            availableFields={availableFields}
            availableTypes={availableTypes}
            searchTerm={searchTerm}
            selectedField={selectedField}
            selectedType={selectedType}
            showOnlyFavorites={showOnlyFavorites}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onSelect={(tableName) => setSelectedDataset(tableName as TableNames)}
            onToggleFavorite={toggleFavorite}
            onSearchChange={setSearchTerm}
            onFieldChange={setSelectedField}
            onTypeChange={setSelectedType}
            onFavoriteChange={setShowOnlyFavorites}
            onColumnsChange={setSelectedColumns}
            onLoad={handleLoad}
            onClosePreview={() => setPreviewData(null)}
          />
        </TabsContent>

        {canQuery && (
          <TabsContent value="query">
            <DatasetQuery 
              selectedDataset={selectedDataset}
              selectedColumns={selectedColumns}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Datasets;