import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDatasetStore } from "@/stores/datasetStore";
import type { Database } from "@/integrations/supabase/types";
import type { ColumnDef } from "@tanstack/react-table";

type TableNames = keyof Database['public']['Tables'];

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const { toast } = useToast();
  const { addQueryResult, getQueryResult } = useDatasetStore();

  const { data: columns = [] } = useQuery({
    queryKey: ['columns', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return [];
      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: `SELECT * FROM "${selectedDataset}" LIMIT 1`
      });
      
      if (error) throw error;
      
      if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
        return Object.keys(queryResult[0]).filter(col => !col.startsWith('md_'));
      }
      return [];
    },
    enabled: !!selectedDataset
  });

  const { data: totalRowCount = 0 } = useQuery({
    queryKey: ['rowCount', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return 0;
      const { data: count, error } = await supabase.rpc('get_table_row_count', {
        table_name: selectedDataset
      });
      if (error) throw error;
      return count || 0;
    },
    enabled: !!selectedDataset
  });

  const { data = [], isLoading, refetch: loadData } = useQuery({
    queryKey: ['tableData', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return [];

      // Check cache first
      const cachedResult = getQueryResult(selectedDataset);
      if (cachedResult) {
        return cachedResult.data;
      }

      const { data: sampleData, error } = await supabase
        .from(selectedDataset)
        .select('*')
        .limit(1000);

      if (error) throw error;

      // Create columns definition
      const cols: ColumnDef<any>[] = Object.keys(sampleData?.[0] || {}).map(key => ({
        accessorKey: key,
        header: key,
      }));

      // Store in cache
      addQueryResult(selectedDataset, sampleData || [], cols, totalRowCount);

      return sampleData || [];
    },
    enabled: false
  });

  const fetchPage = async (page: number, itemsPerPage: number) => {
    if (!selectedDataset) return [];
    
    try {
      const { data: pageData, error } = await supabase
        .from(selectedDataset)
        .select('*')
        .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);
      
      if (error) throw error;
      return pageData || [];
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching page",
        description: error.message
      });
      return [];
    }
  };

  return {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadingProgress,
    fetchPage,
    loadData
  };
};