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
  const pageSize = 1000;

  const fetchWithRetry = async (fn: () => Promise<any>, retries = 3) => {
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

  const fetchColumns = async (tableName: TableNames) => {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) throw error;
    
    if (data && data.length > 0) {
      return Object.keys(data[0]).filter(col => !col.startsWith('md_'));
    }
    return [];
  };

  const loadData = async (tableName: TableNames) => {
    setIsLoading(true);
    try {
      // First get total count
      const { data: countResult, error: countError } = await supabase
        .rpc('get_table_row_count', { table_name: tableName });
      
      if (countError) throw countError;
      
      const totalRows = countResult || 0;
      setTotalRowCount(totalRows);

      // Get available columns first
      const availableColumns = await fetchColumns(tableName);
      setColumns(availableColumns);

      // Calculate number of pages needed
      const numberOfPages = Math.ceil(totalRows / pageSize);
      let allData: any[] = [];

      // Fetch data in chunks
      for (let i = 0; i < numberOfPages; i++) {
        const from = i * pageSize;
        const to = from + pageSize - 1;

        const { data: pageData, error } = await fetchWithRetry(async () => {
          return await supabase
            .from(tableName)
            .select(availableColumns.join(','))
            .range(from, to);
        });

        if (error) throw error;
        if (pageData) {
          allData = [...allData, ...pageData];
        }

        // Update progress
        const progress = Math.round((i + 1) / numberOfPages * 100);
        if (progress % 20 === 0) {
          toast({
            title: "Loading data",
            description: `${progress}% complete...`
          });
        }
      }

      setData(allData);
      
      toast({
        title: "Success",
        description: `Loaded ${allData.length} rows successfully`
      });

    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load data"
      });
    } finally {
      setIsLoading(false);
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
        // Get initial count
        const { data: countResult, error: countError } = await supabase
          .rpc('get_table_row_count', {
            table_name: selectedDataset
          });

        if (countError) throw countError;
        setTotalRowCount(countResult || 0);

        // Get available columns first
        const availableColumns = await fetchColumns(selectedDataset);
        setColumns(availableColumns);

        // Fetch initial chunk for preview
        const { data: initialData, error: initialError } = await supabase
          .from(selectedDataset)
          .select(availableColumns.join(','))
          .limit(pageSize);

        if (initialError) throw initialError;
        
        if (initialData) {
          setData(initialData);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch data"
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
    
    try {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage - 1;
      
      const { data: pageData, error } = await fetchWithRetry(async () => {
        return await supabase
          .from(selectedDataset)
          .select(columns.join(','))
          .range(start, end);
      });
      
      if (error) throw error;
      return pageData;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching page",
        description: error.message
      });
    }
  };

  return {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData
  };
};