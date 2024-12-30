import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchDataInBatches } from "@/utils/batchProcessing";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

const BATCH_THRESHOLD = 250000;
const INITIAL_SAMPLE_SIZE = 1000;

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const { toast } = useToast();
  
  const pageSize = 1000;

  // Use React Query for data fetching and caching
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['dataset', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return [];
      
      try {
        const { data: countResult } = await supabase
          .rpc('get_table_row_count', { table_name: selectedDataset });
        
        setTotalRowCount(countResult || 0);

        // Get initial sample data
        const columnList = await fetchColumns(selectedDataset);
        setColumns(columnList);

        const { data: sampleData, error } = await supabase.rpc('execute_query', {
          query_text: `SELECT ${columnList.map(col => `"${col}"`).join(',')} FROM "${selectedDataset}" LIMIT ${INITIAL_SAMPLE_SIZE}`
        });

        if (error) throw error;
        return Array.isArray(sampleData) ? sampleData : [];

      } catch (error: any) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load data"
        });
        return [];
      }
    },
    enabled: !!selectedDataset,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
  });

  const fetchColumns = async (tableName: TableNames) => {
    const { data: queryResult, error } = await supabase.rpc('execute_query', {
      query_text: `SELECT * FROM "${tableName}" LIMIT 1`
    });

    if (error) throw error;
    
    if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
      return Object.keys(queryResult[0]).filter(col => !col.startsWith('md_'));
    }
    return [];
  };

  const loadData = async (tableName: TableNames, selectedColumns: string[] = [], useBatchProcessing: boolean = false) => {
    if (!tableName) return;
    
    setLoadingProgress(0);
    
    try {
      const { data: countResult } = await supabase
        .rpc('get_table_row_count', { table_name: tableName });
      
      const totalRows = countResult || 0;
      setTotalRowCount(totalRows);

      const columnsToUse = selectedColumns.length > 0 ? 
        selectedColumns : 
        await fetchColumns(tableName);
      
      setColumns(columnsToUse);

      if (useBatchProcessing && totalRows > BATCH_THRESHOLD) {
        toast({
          title: "Large Dataset Detected",
          description: `Loading ${totalRows.toLocaleString()} rows using batch processing...`,
          duration: 5000,
        });

        const batchData = await fetchDataInBatches(
          tableName, 
          columnsToUse,
          (progress) => {
            setLoadingProgress(progress);
            if (progress % 20 === 0) {
              toast({
                title: "Loading data",
                description: `${progress}% complete`
              });
            }
          }
        );
        
        // Invalidate the query cache to trigger a refetch
        refetch();
        
        toast({
          title: "Success",
          description: `Loaded ${batchData.length} rows using batch processing`
        });
      } else {
        // For smaller datasets, trigger a refetch
        refetch();
      }

    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load data"
      });
    } finally {
      setLoadingProgress(0);
    }
  };

  const fetchPage = async (page: number, itemsPerPage: number) => {
    if (!selectedDataset) return;
    
    try {
      const start = page * itemsPerPage;
      const columnList = columns.map(col => `"${col}"`).join(',');
      
      const { data: pageData, error } = await supabase.rpc('execute_query', {
        query_text: `SELECT ${columnList} FROM "${selectedDataset}" OFFSET ${start} LIMIT ${itemsPerPage}`
      });
      
      if (error) throw error;
      
      return Array.isArray(pageData) ? pageData : [];
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