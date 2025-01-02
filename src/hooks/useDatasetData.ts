import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchDataInBatches } from "@/utils/batchProcessing";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

const BATCH_THRESHOLD = 250000;
const INITIAL_SAMPLE_SIZE = 1000;

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const { toast } = useToast();

  // Query for fetching columns
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

  // Query for fetching row count
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

  // Query for fetching data
  const { data = [], isLoading, refetch: loadData } = useQuery({
    queryKey: ['tableData', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return [];
      const columnList = columns.map(col => `"${col}"`).join(',');
      const query = `SELECT ${columnList} FROM "${selectedDataset}" LIMIT ${INITIAL_SAMPLE_SIZE}`;

      const { data: sampleData, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) throw error;
      return Array.isArray(sampleData) ? sampleData : [];
    },
    enabled: false // Don't fetch automatically, wait for loadData to be called
  });

  const fetchPage = async (page: number, itemsPerPage: number) => {
    if (!selectedDataset) return [];
    
    try {
      const start = page * itemsPerPage;
      const columnList = columns.map(col => `"${col}"`).join(',');
      
      const { data: pageData, error } = await supabase.rpc('execute_query', {
        query_text: `SELECT ${columnList} FROM "${selectedDataset}" OFFSET ${start} LIMIT ${itemsPerPage}`
      });
      
      if (error) throw error;
      
      if (pageData && Array.isArray(pageData)) {
        return pageData;
      }
      return [];
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