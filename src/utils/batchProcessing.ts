import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const BATCH_SIZE = 1000;

export const fetchDataInBatches = async (
  tableName: string, 
  selectedColumns: string[] = [],
  onProgress?: (progress: number) => void
) => {
  let offset = 0;
  let allData: any[] = [];
  let hasMoreData = true;

  try {
    // Get total count first
    const { data: countResult } = await supabase
      .rpc('get_table_row_count', { table_name: tableName });
    
    const totalRows = countResult || 0;
    
    while (hasMoreData) {
      const columnList = selectedColumns.length > 0 
        ? selectedColumns.map(col => `"${col}"`).join(',')
        : '*';

      const query = `
        SELECT ${columnList} 
        FROM "${tableName}" 
        OFFSET ${offset} 
        LIMIT ${BATCH_SIZE}
      `;

      const { data: batchData, error } = await supabase.rpc('execute_query', {
        query_text: query
      });

      if (error) {
        console.error('Error fetching batch:', error);
        throw error;
      }

      if (!batchData || !Array.isArray(batchData)) {
        hasMoreData = false;
        continue;
      }

      allData = [...allData, ...batchData];
      
      // Calculate and report progress
      const progress = Math.min(100, Math.round((allData.length / totalRows) * 100));
      onProgress?.(progress);

      console.log(`Loaded batch: ${offset}-${offset + batchData.length} of ${totalRows} rows`);
      
      if (batchData.length < BATCH_SIZE) {
        hasMoreData = false;
      } else {
        offset += BATCH_SIZE;
      }
    }

    return allData;
  } catch (error: any) {
    console.error('Error in batch processing:', error);
    toast({
      variant: "destructive",
      title: "Error fetching data",
      description: error.message || "Failed to fetch data in batches"
    });
    throw error;
  }
};