import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DatasetOverview } from "@/components/datasets/DatasetOverview";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

const Datasets = () => {
  const { favorites, toggleFavorite } = useFavorites();
  
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_available_tables');
      if (error) throw error;
      return data;
    },
  });

  const handlePreview = async (tableName: TableNames) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10);
      
      if (error) throw error;
      
      // Implement preview logic here
      console.log('Preview data:', data);
    } catch (error) {
      toast.error('Failed to load preview');
    }
  };

  const handleDownload = async (tableName: TableNames) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      
      if (error) throw error;
      
      // Implement download logic here
      console.log('Download data:', data);
    } catch (error) {
      toast.error('Failed to download dataset');
    }
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
    </div>
  );
};

export default Datasets;