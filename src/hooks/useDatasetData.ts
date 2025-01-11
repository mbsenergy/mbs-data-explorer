import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDatasetStore } from "@/stores/datasetStore";
import type { Database } from "@/integrations/supabase/types";
import type { ColumnDef } from "@tanstack/react-table";

type TableNames = keyof Database['public']['Tables'];
type DataRow = Record<string, any>;

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [queryText, setQueryText] = useState<string>("");
  const [apiCall, setApiCall] = useState<string>("");
  const [localData, setLocalData] = useState<DataRow[]>([]);
  const { toast } = useToast();
  const { addQueryResult, getQueryResult } = useDatasetStore();

  const buildQuery = (tableName: string, filterConditions?: string) => {
    let query = `SELECT * FROM "${tableName}"`;
    if (filterConditions && filterConditions.trim()) {
      if (filterConditions.toLowerCase().includes('limit')) {
        query += ` WHERE ${filterConditions}`;
      } else {
        query += ` WHERE ${filterConditions}`;
      }
    }
    return query;
  };

  const { data: columns = [] } = useQuery({
    queryKey: ['columns', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return [];
      
      try {
        const { data: queryResult, error } = await supabase.rpc('execute_query', {
          query_text: `SELECT * FROM "${selectedDataset}" LIMIT 1`
        });
        
        if (error) throw error;
        
        if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
          return Object.keys(queryResult[0]).filter(col => !col.startsWith('md_'));
        }
        return [];
      } catch (error: any) {
        console.error("Error fetching columns:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch columns"
        });
        return [];
      }
    },
    enabled: !!selectedDataset,
    retry: 3
  });

  const { data: totalRowCount = 0 } = useQuery({
    queryKey: ['rowCount', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return 0;
      try {
        const { data: count, error } = await supabase.rpc('get_table_row_count', {
          table_name: selectedDataset
        });
        if (error) throw error;
        return count || 0;
      } catch (error: any) {
        console.error("Error fetching row count:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch row count"
        });
        return 0;
      }
    },
    enabled: !!selectedDataset,
    retry: 3
  });

  const loadDataWithFilters = async (filterConditions?: string) => {
    if (!selectedDataset) return [];

    console.log("Loading data with filters:", filterConditions);
    
    try {
      const query = buildQuery(selectedDataset, filterConditions);
      setQueryText(query);
      setApiCall(`await supabase.rpc('execute_query', {
        query_text: \`${query}\`
      });`);
      console.log("Executing query:", query);

      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) throw error;

      const resultArray = queryResult as DataRow[] || [];
      console.log("Fetched data:", resultArray);

      // Convert string[] columns to ColumnDef[]
      const columnDefs: ColumnDef<any>[] = columns.map(col => ({
        accessorKey: col,
        header: col
      }));

      // Store in cache and update local data
      addQueryResult(selectedDataset, resultArray, columnDefs, totalRowCount, query);
      setLocalData(resultArray);

      return resultArray;
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load data"
      });
      throw error;
    }
  };

  return {
    data: localData,
    setData: setLocalData,
    columns,
    totalRowCount,
    isLoading: false,
    loadData: loadDataWithFilters,
    queryText,
    apiCall
  };
};