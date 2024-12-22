import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { PreviewDialog } from "@/components/developer/PreviewDialog";
import { DatasetActivity } from "@/components/datasets/DatasetActivity";
import { DatasetSearch } from "@/components/datasets/DatasetSearch";
import { DatasetExplore } from "@/components/datasets/DatasetExplore";
import { useFavorites } from "@/hooks/useFavorites";
import type { TableInfo } from "@/components/datasets/types";

const Datasets = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<{ tableName: string; data: string } | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  useEffect(() => {
    if (tables) {
      const fields = [...new Set(tables.map(table => {
        const match = table.tablename.match(/^([A-Z]{2})\d+_/);
        return match ? match[1] : null;
      }).filter(Boolean))];
      
      const types = [...new Set(tables.map(table => {
        const match = table.tablename.match(/^[A-Z]{2}(\d+)_/);
        return match ? match[1] : null;
      }).filter(Boolean))];
      
      setAvailableFields(fields as string[]);
      setAvailableTypes(types as string[]);
    }
  }, [tables]);

  const filteredTables = tables?.filter(table => {
    const matchesSearch = table.tablename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "all" || table.tablename.startsWith(selectedField);
    const matchesType = selectedType === "all" || table.tablename.match(new RegExp(`^[A-Z]{2}${selectedType}_`));
    return matchesSearch && matchesField && matchesType;
  });

  const handleDownload = async (tableName: string) => {
    if (!user?.id) return;

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

    const { data, error } = await supabase
      .from(tableName as any)
      .select("*")
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
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Dataset downloaded successfully.",
    });
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

  const handleSelect = async (tableName: string) => {
    await navigator.clipboard.writeText(tableName);
    toast({
      title: "Success",
      description: "Table name copied to clipboard.",
    });
  };

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
      
      <DatasetActivity 
        favorites={favorites}
        tables={tables || []}
        onPreview={handlePreview}
        onDownload={handleDownload}
      />

      <DatasetSearch
        tables={filteredTables || []}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onSelect={handleSelect}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
        onSearchChange={setSearchTerm}
        onFieldChange={setSelectedField}
        onTypeChange={setSelectedType}
        availableFields={availableFields}
        availableTypes={availableTypes}
      />

      <DatasetExplore />

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

export default Datasets;