import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const initialFetchLimit = 1000;
  const maxRetries = 3;

  const fetchWithRetry = async (fn: () => Promise<any>, retries = maxRetries) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry(fn, retries - 1);
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDataset) {
        setData([]);
        setColumns([]);
        setTotalRowCount(0);
        return;
      }

      setIsLoading(true);

      try {
        // First fetch total count using our new SQL function
        const { data: countResult, error: countError } = await supabase
          .rpc('get_table_row_count', {
            table_name: selectedDataset
          });

        if (countError) throw countError;
        setTotalRowCount(countResult || 0);

        // Then fetch first chunk of data with retry mechanism
        const dataResult = await fetchWithRetry(async () => {
          const { data: tableData, error } = await supabase
            .from(selectedDataset)
            .select("*")
            .range(0, initialFetchLimit - 1);

          if (error) throw error;
          return tableData;
        });

        if (dataResult && dataResult.length > 0) {
          const filteredColumns = Object.keys(dataResult[0]).filter(
            col => !col.startsWith('md_')
          );
          setColumns(filteredColumns);
          setData(dataResult);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
        setData([]);
        setColumns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDataset, toast]);

  const fetchPage = async (page: number, itemsPerPage: number) => {
    if (!selectedDataset) return;
    
    setIsLoading(true);
    try {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage - 1;
      
      const { data: pageData, error } = await fetchWithRetry(async () => {
        const response = await supabase
          .from(selectedDataset)
          .select("*")
          .range(start, end);
        
        if (response.error) throw response.error;
        return response;
      });
      
      return pageData;
    } catch (error: any) {
      toast({
        title: "Error fetching page",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage
  };
};