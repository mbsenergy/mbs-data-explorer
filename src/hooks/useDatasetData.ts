import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

const MAX_SAFE_ROWS = 100000; // Maximum number of rows we can safely load

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const pageSize = 1000;
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
    const { data: queryResult, error } = await supabase.rpc('execute_query', {
      query_text: `SELECT * FROM "${tableName}" LIMIT 1`
    });

    if (error) throw error;
    
    if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
      return Object.keys(queryResult[0]).filter(col => !col.startsWith('md_'));
    }
    return [];
  };

  const loadData = async (tableName: TableNames, selectedColumns: string[] = []) => {
    setIsLoading(true);
    try {
      const { data: countResult, error: countError } = await supabase
        .rpc('get_table_row_count', { table_name: tableName });
      
      if (countError) throw countError;
      
      const totalRows = countResult || 0;
      setTotalRowCount(totalRows);

      // Check if dataset is too large
      if (totalRows > MAX_SAFE_ROWS) {
        toast({
          variant: "destructive",
          title: "Dataset too large",
          description: `This dataset has ${totalRows.toLocaleString()} rows. Please use the pagination controls to browse the data or export specific sections.`
        });
        // Load just the first page
        const columnsToUse = selectedColumns.length > 0 ? 
          selectedColumns : 
          await fetchColumns(tableName);
        
        setColumns(columnsToUse);
        const columnList = columnsToUse.map(col => `"${col}"`).join(',');
        const { data: initialData, error } = await supabase.rpc('execute_query', {
          query_text: `SELECT ${columnList} FROM "${tableName}" LIMIT ${pageSize}`
        });

        if (error) throw error;
        if (initialData && Array.isArray(initialData)) {
          setData(initialData);
        }
        return;
      }

      const columnsToUse = selectedColumns.length > 0 ? 
        selectedColumns : 
        await fetchColumns(tableName);
      
      setColumns(columnsToUse);

      const numberOfPages = Math.ceil(totalRows / pageSize);
      let allData: any[] = [];

      for (let i = 0; i < numberOfPages; i++) {
        const from = i * pageSize;

        const { data: pageData, error } = await fetchWithRetry(async () => {
          const columnList = columnsToUse.map(col => `"${col}"`).join(',');
          return await supabase.rpc('execute_query', {
            query_text: `SELECT ${columnList} FROM "${tableName}" OFFSET ${from} LIMIT ${pageSize}`
          });
        });

        if (error) throw error;
        
        if (pageData && Array.isArray(pageData)) {
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
        const { data: countResult, error: countError } = await supabase
          .rpc('get_table_row_count', { table_name: selectedDataset });

        if (countError) throw countError;
        const totalRows = countResult || 0;
        setTotalRowCount(totalRows);

        // Only load first page if dataset is too large
        if (totalRows > MAX_SAFE_ROWS) {
          toast({
            variant: "destructive",
            title: "Dataset too large",
            description: `This dataset has ${totalRows.toLocaleString()} rows. Please use the pagination controls to browse the data.`
          });
          const availableColumns = await fetchColumns(selectedDataset);
          setColumns(availableColumns);
          
          const columnList = availableColumns.map(col => `"${col}"`).join(',');
          const { data: initialData, error: queryError } = await supabase.rpc('execute_query', {
            query_text: `SELECT ${columnList} FROM "${selectedDataset}" LIMIT ${pageSize}`
          });

          if (queryError) throw queryError;
          if (initialData && Array.isArray(initialData)) {
            setData(initialData);
          }
          return;
        }

        const availableColumns = await fetchColumns(selectedDataset);
        setColumns(availableColumns);

        const columnList = availableColumns.map(col => `"${col}"`).join(',');
        const { data: queryResult, error: queryError } = await supabase.rpc('execute_query', {
          query_text: `SELECT ${columnList} FROM "${selectedDataset}"`
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
    fetchPage,
    loadData
  };
};