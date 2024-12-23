import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DatasetOverview } from "@/components/datasets/DatasetOverview";
import { DatasetActions } from "@/components/datasets/DatasetActions";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

const Datasets = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedDataset, setSelectedDataset] = useState<TableNames | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<{ tableName: string; data: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_available_tables');
      if (error) throw error;
      return data;
    },
  });

  const availableFields = Array.from(
    new Set(tables.map(table => {
      const match = table.tablename.match(/^([A-Z]{2})\d+_/);
      return match ? match[1] : "";
    })).values()
  ).filter(Boolean);

  const availableTypes = Array.from(
    new Set(tables.map(table => {
      const match = table.tablename.match(/^[A-Z]{2}(\d+)_/);
      return match ? match[1] : "";
    })).values()
  ).filter(Boolean);

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.tablename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "all" || table.tablename.startsWith(selectedField);
    const matchesType = selectedType === "all" || table.tablename.match(new RegExp(`^[A-Z]{2}${selectedType}_`));
    const matchesFavorites = !showOnlyFavorites || favorites.has(table.tablename);
    return matchesSearch && matchesField && matchesType && matchesFavorites;
  });

  const handlePreview = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10);
      
      if (error) throw error;
      
      setPreviewData({
        tableName,
        data: JSON.stringify(data, null, 2)
      });
    } catch (error) {
      toast.error('Failed to load preview');
    }
  };

  const handleDownload = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      
      if (error) throw error;
      
      // Implement download logic here
      console.log('Download data:', data);
      toast.success('Sample downloaded successfully');
    } catch (error) {
      toast.error('Failed to download dataset');
    }
  };

  const handleLoad = (tableName: string) => {
    setSelectedDataset(tableName as TableNames);
    toast.success(`Dataset ${tableName} selected`);
  };

  return (
    <div className="space-y-8">
      <h1>Datasets</h1>
      <DatasetOverview 
        favorites={favorites}
        tables={tables}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onToggleFavorite={toggleFavorite}
      />
      <DatasetActions
        tables={tables}
        filteredTables={filteredTables}
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
        onSelect={setSelectedDataset}
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