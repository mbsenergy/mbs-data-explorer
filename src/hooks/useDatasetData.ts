import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setData, setColumns, cacheQuery } from "@/store/slices/datasetSlice";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const cachedQueries = useAppSelector(state => state.dataset.cachedQueries);

  const { data: columns = [], isLoading: columnsLoading } = useQuery({
    queryKey: ['columns', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return [];
      
      console.log('Fetching columns for:', selectedDataset);
      
      // Check cache first
      const cacheKey = `columns_${selectedDataset}`;
      const cached = cachedQueries[cacheKey];
      if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
        return cached.columns;
      }
      
      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: `SELECT * FROM "${selectedDataset}" LIMIT 1`
      });
      
      if (error) {
        console.error('Error fetching columns:', error);
        throw error;
      }
      
      if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
        const cols = Object.keys(queryResult[0]).filter(col => !col.startsWith('md_'));
        console.log('Retrieved columns:', cols);
        
        // Cache the result
        dispatch(cacheQuery({
          query: cacheKey,
          data: queryResult,
          columns: cols,
        }));
        
        return cols;
      }
      return [];
    },
    enabled: !!selectedDataset,
    staleTime: Infinity,
    gcTime: 1800000, // 30 minutes
  });

  const { data: totalRowCount = 0 } = useQuery({
    queryKey: ['rowCount', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return 0;
      
      console.log('Fetching row count for:', selectedDataset);
      
      const { data: count, error } = await supabase.rpc('get_table_row_count', {
        table_name: selectedDataset
      });
      
      if (error) {
        console.error('Error fetching row count:', error);
        throw error;
      }
      
      console.log('Retrieved row count:', count);
      return count || 0;
    },
    enabled: !!selectedDataset,
    staleTime: Infinity,
    gcTime: 1800000,
  });

  const { data = [], isLoading, refetch: loadData } = useQuery({
    queryKey: ['tableData', selectedDataset],
    queryFn: async () => {
      if (!selectedDataset) return [];
      
      console.log('Fetching data for:', selectedDataset);
      
      // Check cache first
      const cacheKey = `data_${selectedDataset}`;
      const cached = cachedQueries[cacheKey];
      if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
        dispatch(setData(cached.data));
        return cached.data;
      }
      
      const { data: sampleData, error } = await supabase
        .from(selectedDataset)
        .select('*')
        .limit(1000);

      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
      
      console.log('Retrieved data rows:', sampleData?.length);
      
      // Cache the result
      if (sampleData) {
        dispatch(cacheQuery({
          query: cacheKey,
          data: sampleData,
          columns: columns,
        }));
        dispatch(setData(sampleData));
      }
      
      return sampleData || [];
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: 1800000,
  });

  const fetchPage = async (page: number, itemsPerPage: number) => {
    if (!selectedDataset) return [];
    
    try {
      console.log('Fetching page:', page, 'with size:', itemsPerPage);
      
      const { data: pageData, error } = await supabase
        .from(selectedDataset)
        .select('*')
        .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);
      
      if (error) throw error;
      
      console.log('Retrieved page data rows:', pageData?.length);
      return pageData || [];
    } catch (error: any) {
      console.error('Error fetching page:', error);
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
    isLoading: isLoading || columnsLoading,
    loadingProgress,
    fetchPage,
    loadData
  };
};