import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatasetTable } from "@/components/datasets/explore/DatasetTable";
import type { TableInfo, ColumnDefWithAccessor } from "@/components/datasets/types";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

export default function Visualize() {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDefWithAccessor[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const handleExecuteQuery = async (tableName: TableNames) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);

      if (error) throw error;

      if (data) {
        const cols: ColumnDefWithAccessor[] = Object.keys(data[0]).map(key => ({
          accessorKey: key,
          header: key,
          cell: info => String(info.getValue() ?? ''),
        }));
        setColumns(cols);
        setData(data);
        setSelectedColumns(cols.map(col => col.accessorKey));
      }
    } catch (error: any) {
      console.error('Error executing query:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to execute query"
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Visualize Data</h1>
      {tablesLoading ? (
        <p>Loading tables...</p>
      ) : (
        <div>
          {tables?.map((table: TableInfo) => (
            <button 
              key={table.tablename} 
              onClick={() => handleExecuteQuery(table.tablename as TableNames)}
              className="mr-2 mb-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              {table.tablename}
            </button>
          ))}
        </div>
      )}
      <DatasetTable 
        data={data} 
        columns={columns} 
        selectedColumns={selectedColumns} 
      />
    </div>
  );
}