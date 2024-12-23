import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { DatasetActions } from "@/components/datasets/DatasetActions";
import { useFavorites } from "@/hooks/useFavorites";
import type { TableInfo } from "@/components/datasets/types";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

const Datasets = () => {
  const { toast } = useToast();
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
      // First get the row count
      const { data: countData, error: countError } = await supabase
        .rpc('get_table_row_count', { table_name: tableName });
      
      if (countError) throw countError;
      
      // Check if row count is within limit
      if (countData > 100000) {
        toast({
          variant: "destructive",
          title: "Dataset too large",
          description: "Cannot load datasets with more than 100,000 rows. Please use the sample feature instead."
        });
        return;
      }

      // Fetch the full dataset
      const { data, error } = await supabase
        .from(tableName as any)
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
    const { data, error } = await supabase
      .from(tableName as any)
      .select("*")
      .limit(30);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to preview dataset.",
      });
      return;
    }

    const previewRows = [...data.slice(0, 15), ...data.slice(-15)];
    setPreviewData({
      tableName,
      data: JSON.stringify(previewRows, null, 2)
    });
  };

  const handleDownload = async (tableName: string) => {
    if (!user?.id) return;

    // Track analytics
    const { error: analyticsError } = await supabase
      .from("analytics")
      .insert({
        user_id: user.id,
        dataset_name: tableName,
        is_custom_query: false,
      });

    if (analyticsError) {
      console.error("Error tracking download:", analyticsError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to track download activity.",
      });
      return;
    }

    // Download data with selected columns and filters
    const { data, error } = await supabase
      .from(tableName as any)
      .select(selectedColumns.join(','))
      .limit(1000);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download dataset.",
      });
      return;
    }

    const csv = [
      selectedColumns.join(','),
      ...data.map(row => selectedColumns.map(col => row[col]).join(','))
    ].join('\n');
    
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Datasets</h1>
      
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
    </div>
  );
};

export default Datasets;