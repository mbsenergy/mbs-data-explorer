import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatasetTable } from "@/components/datasets/explore/DatasetTable";
import type { TableNames } from "@/components/datasets/types";
import { ColumnDefWithAccessor } from "@/components/datasets/types";

export default function Visualize() {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDefWithAccessor[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<TableNames | null>(null);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data;
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
          {tables.map((table: TableNames) => (
            <button key={table} onClick={() => handleExecuteQuery(table)}>
              {table}
            </button>
          ))}
        </div>
      )}
      <DatasetTable data={data} columns={columns} selectedColumns={columns.map(col => col.accessorKey)} />
    </div>
  );
}
