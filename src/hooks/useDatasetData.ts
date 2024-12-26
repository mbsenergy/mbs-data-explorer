import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const pageSize = 1000; // Chunk size for fetching data
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

  const fetchColumns = async (tableName: TableNames) => {
    // Use RPC call to execute_query instead of direct table query
    const { data: queryResult, error } = await supabase.rpc('execute_query', {
      query_text: `SELECT * FROM "${tableName}" LIMIT 1`
    });

    if (error) throw error;
    
    // queryResult is an array of objects, take the first one if it exists
    if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
      return Object.keys(queryResult[0]).filter(col => !col.startsWith('md_'));
    }
    return [];
  };

  const loadData = async (tableName: TableNames, selectedColumns: string[] = []) => {
    setIsLoading(true);
    try {
      // First get total count
      const { data: countResult, error: countError } = await supabase
        .rpc('get_table_row_count', { table_name: tableName });
      
      if (countError) throw countError;
      
      const totalRows = countResult || 0;
      setTotalRowCount(totalRows);

      // Get available columns if not provided
      const columnsToUse = selectedColumns.length > 0 ? 
        selectedColumns : 
        await fetchColumns(tableName);
      
      setColumns(columnsToUse);

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
            .select(columnsToUse.join(','))
            .range(from, to);
        });

        if (error) throw error;
        
        if (pageData) {
          allData = [...allData, ...pageData];
          console.log(`Loaded chunk ${i + 1}/${numberOfPages} (${pageData.length} rows)`);
        }
      }

      setData(allData);
      console.log(`Loaded ${allData.length} rows successfully`);
      
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
      setData([]);
      setColumns([]);
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
        // Get total count
        const { data: countResult, error: countError } = await supabase
          .rpc('get_table_row_count', { table_name: selectedDataset });

        if (countError) throw countError;
        setTotalRowCount(countResult || 0);

        // Get available columns
        const availableColumns = await fetchColumns(selectedDataset);
        setColumns(availableColumns);

        // Fetch initial data
        const { data: queryResult, error: queryError } = await supabase.rpc('execute_query', {
          query_text: `SELECT ${availableColumns.join(',')} FROM "${selectedDataset}"`
        });

        if (queryError) throw queryError;
        
        if (queryResult && Array.isArray(queryResult)) {
          setData(queryResult);
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load data"
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
      
      const { data: pageData, error } = await supabase.rpc('execute_query', {
        query_text: `SELECT ${columns.join(',')} FROM "${selectedDataset}" OFFSET ${start} LIMIT ${itemsPerPage}`
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
    fetchPage,
    loadData
  };
};