import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import DatasetFilters from "@/components/datasets/DatasetFilters";
import { PreviewDialog } from "@/components/developer/PreviewDialog";
import { DatasetTable } from "@/components/datasets/DatasetTable";
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  // Extract unique fields and types from table names
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

  // Filter tables based on search term, selected field, and selected type
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

  const handleToggleFavorite = (tableName: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tableName)) {
        newFavorites.delete(tableName);
      } else {
        newFavorites.add(tableName);
      }
      return newFavorites;
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Datasets</h1>
      
      <Card className="p-6">
        <DatasetFilters
          onSearchChange={setSearchTerm}
          onFieldChange={setSelectedField}
          onTypeChange={setSelectedType}
          availableFields={availableFields}
          availableTypes={availableTypes}
        />

        {tablesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <DatasetTable
            tables={filteredTables || []}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onSelect={handleSelect}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        )}
      </Card>

      {previewData && (
        <PreviewDialog
          isOpen={!!previewData}
          onClose={() => setPreviewData(null)}
          filePath={previewData.data}
          fileName={previewData.tableName}
          section="datasets"
        />
      )}
    </div>
  );
};

export default Datasets;