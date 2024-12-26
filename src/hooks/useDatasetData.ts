import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchDataInBatches } from "@/utils/batchProcessing";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

const BATCH_THRESHOLD = 250000; // Changed from 250,000 to match requirement
const INITIAL_SAMPLE_SIZE = 1000;

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const { toast } = useToast();
  
  const pageSize = 1000;

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

  // Function to load initial sample data
  const loadSampleData = async (tableName: TableNames, columnsToUse: string[]) => {
    const columnList = columnsToUse.map(col => `"${col}"`).join(',');
    const query = `SELECT ${columnList} FROM "${tableName}" LIMIT ${INITIAL_SAMPLE_SIZE}`;

    const { data: sampleData, error } = await supabase.rpc('execute_query', {
      query_text: query
    });

    if (error) throw error;
    return sampleData;
  };

  const loadData = async (tableName: TableNames, selectedColumns: string[] = [], useBatchProcessing: boolean = false) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      const { data: countResult, error: countError } = await supabase
        .rpc('get_table_row_count', { table_name: tableName });
      
      if (countError) throw countError;
      
      const totalRows = countResult || 0;
      setTotalRowCount(totalRows);
      console.log('Total rows:', totalRows); // Debug log

      const columnsToUse = selectedColumns.length > 0 ? 
        selectedColumns : 
        await fetchColumns(tableName);
      
      setColumns(columnsToUse);

      // Check if batch processing should be used
      const shouldUseBatchProcessing = useBatchProcessing && totalRows > BATCH_THRESHOLD;
      console.log('Should use batch processing:', shouldUseBatchProcessing); // Debug log
      
      if (shouldUseBatchProcessing) {
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
        setData(batchData);
        
        toast({
          title: "Success",
          description: `Loaded ${batchData.length} rows using batch processing`
        });
        return;
      }

      // For initial load or smaller datasets, fetch sample data
      const sampleData = await loadSampleData(tableName, columnsToUse);
      
      if (sampleData && Array.isArray(sampleData)) {
        setData(sampleData);
        toast({
          title: "Success",
          description: `Loaded ${sampleData.length} sample rows`
        });
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
      setLoadingProgress(0);
    }
  };

  useEffect(() => {
    if (!selectedDataset) {
      setData([]);
      setColumns([]);
      setTotalRowCount(0);
      return;
    }

    // Initial load with sample data
    loadData(selectedDataset, [], false);
  }, [selectedDataset]);

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
    loadingProgress,
    fetchPage,
    loadData
  };
};