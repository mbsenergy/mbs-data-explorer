import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDatasetStore } from "@/stores/datasetStore";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [queryText, setQueryText] = useState<string>("");
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
    queryFn: async ({ queryKey }) => {
      if (!selectedDataset) return [];

      console.log("Loading data for dataset:", selectedDataset);

      // Check cache first
      const cachedResult = getQueryResult(selectedDataset);
      if (cachedResult) {
        console.log("Using cached data:", cachedResult);
        setQueryText(cachedResult.queryText || "");
        return cachedResult.data;
      }

      const baseQuery = `SELECT * FROM "${selectedDataset}"`;
      const whereClause = queryKey[2] ? ` WHERE ${queryKey[2]}` : '';
      const limitClause = ' LIMIT 1000';
      
      const query = baseQuery + whereClause + limitClause;
      setQueryText(query);

      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) throw error;

      console.log("Fetched new data:", queryResult);

      // Store in cache
      addQueryResult(selectedDataset, queryResult || [], columns, totalRowCount, query);

      return queryResult || [];
    },
    enabled: false // Don't auto-fetch, wait for manual trigger
  });

  const fetchPage = async (page: number, pageSize: number) => {
    if (!selectedDataset) return null;

    try {
      const start = page * pageSize;
      const query = `SELECT * FROM "${selectedDataset}" LIMIT ${pageSize} OFFSET ${start}`;
      setQueryText(query);

      const { data: pageData, error } = await supabase
        .from(selectedDataset)
        .select('*')
        .range(start, start + pageSize - 1);

      if (error) {
        console.error("Error fetching page:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data page"
        });
        return null;
      }

      return pageData;
    } catch (error) {
      console.error("Error in fetchPage:", error);
      return null;
    }
  };

  // Modified loadData to accept filter conditions
  const loadDataWithFilters = async (filterConditions?: string) => {
    return refetch({ queryKey: ['tableData', selectedDataset, filterConditions] });
  };

  return {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadingProgress,
    loadData: loadDataWithFilters,
    fetchPage,
    queryText
  };
};