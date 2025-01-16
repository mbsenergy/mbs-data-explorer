import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDatasetStore } from "@/stores/datasetStore";
import type { Database } from "@/integrations/supabase/types";
import type { Filter } from "@/components/datasets/explore/types";

type TableNames = keyof Database['public']['Tables'];
type DataRow = Record<string, any>;

export const useDatasetData = (selectedDataset: TableNames | null) => {
  const { toast } = useToast();
  const { addQueryResult, getQueryResult } = useDatasetStore();
  
  const savedState = selectedDataset ? getQueryResult(selectedDataset) : null;
  const [queryText, setQueryText] = useState<string>(savedState?.queryText || "");
  const [apiCall, setApiCall] = useState<string>("");
  const [localData, setLocalData] = useState<DataRow[]>(savedState?.data || []);

  const buildQuery = (tableName: string, filters?: Filter[]) => {
    let query = `SELECT * FROM "${tableName}"`;
    
    if (filters && filters.length > 0) {
      const filterConditions = filters
        .filter(f => f.searchTerm && f.selectedColumn) // Only include filters with both terms
        .map((filter, index) => {
          const { selectedColumn, searchTerm, operator, comparisonOperator } = filter;
          let condition = '';
          
          // Add AND/OR operator except for first condition
          if (index > 0) {
            condition += ` ${operator} `;
          }

          // Handle different comparison operators
          switch (comparisonOperator) {
            case 'IN':
            case 'NOT IN':
              const values = searchTerm.split(',').map(v => `'${v.trim()}'`).join(',');
              condition += `"${selectedColumn}" ${comparisonOperator} (${values})`;
              break;
            default:
              condition += `"${selectedColumn}" ${comparisonOperator} '${searchTerm}'`;
          }
          
          return condition;
        });

      if (filterConditions.length > 0) {
        query += ` WHERE ${filterConditions.join(' ')}`;
      }
    }
    
    console.log("Built query:", query);
    return query;
  };

  // Query for columns
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

  // Query for row count
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

  // Load initial 1000 rows
  const loadInitialData = async () => {
    if (!selectedDataset) return;

    try {
      const query = `SELECT * FROM "${selectedDataset}" LIMIT 1000`;
      console.log("Loading initial data with query:", query);
      
      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) throw error;

      const resultArray = queryResult as DataRow[] || [];
      console.log("Initial data loaded:", resultArray.length, "rows");
      
      // Store in cache and update local state
      addQueryResult(
        selectedDataset,
        resultArray,
        columns.map(col => ({ 
          accessorKey: col, 
          header: col 
        })),
        totalRowCount,
        query
      );

      setLocalData(resultArray);
      setQueryText(query);
      return resultArray;
    } catch (error: any) {
      console.error("Error loading initial data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load initial data"
      });
      throw error;
    }
  };

  const loadData = async (filters?: Filter[]) => {
    if (!selectedDataset) return [];

    try {
      const query = buildQuery(selectedDataset, filters);
      console.log("Executing query with filters:", query);
      setQueryText(query);
      setApiCall(`await supabase.rpc('execute_query', {
        query_text: \`${query}\`
      });`);

      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) throw error;

      const resultArray = queryResult as DataRow[] || [];
      console.log("Fetched data:", resultArray.length, "rows");

      // Update local data state and store
      setLocalData(resultArray);
      addQueryResult(
        selectedDataset,
        resultArray,
        columns.map(col => ({ 
          accessorKey: col, 
          header: col 
        })),
        totalRowCount,
        query
      );

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
    loadData,
    loadInitialData,
    queryText,
    apiCall
  };
};