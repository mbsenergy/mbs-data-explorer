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
  const initialFetchLimit = 10000;

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
        // First fetch total count
        const { count, error: countError } = await supabase
          .from(selectedDataset)
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        setTotalRowCount(count || 0);

        // Then fetch first 10,000 rows of data
        const { data: tableData, error } = await supabase
          .from(selectedDataset)
          .select("*")
          .range(0, initialFetchLimit - 1);

        if (error) throw error;

        if (tableData.length > 0) {
          const filteredColumns = Object.keys(tableData[0]).filter(
            col => !col.startsWith('md_')
          );
          setColumns(filteredColumns);
          setData(tableData);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
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
      const end = Math.min(start + itemsPerPage - 1, initialFetchLimit - 1);
      
      const { data: pageData, error } = await supabase
        .from(selectedDataset)
        .select("*")
        .range(start, end);
      
      if (error) throw error;
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