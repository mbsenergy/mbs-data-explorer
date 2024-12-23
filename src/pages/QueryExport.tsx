import { useState } from "react";
import { Card } from "@/components/ui/card";
import SqlEditor from "@/components/datasets/SqlEditor";
import { DatasetExport } from "@/components/datasets/export/DatasetExport";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const QueryExport = () => {
  const { toast } = useToast();
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleExecute = async (query: string) => {
    try {
      const { data, error } = await supabase.rpc('execute_query', { query_text: query });
      
      if (error) throw error;
      
      toast({
        title: "Query executed successfully",
        description: `Retrieved ${Array.isArray(data) ? data.length : 0} rows`,
      });
      
    } catch (error: any) {
      console.error("Error executing query:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to execute query",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Query & Export</h1>
      
      <Card className="p-6">
        <SqlEditor onExecute={handleExecute} />
      </Card>

      <DatasetExport 
        selectedDataset={selectedDataset}
        selectedColumns={selectedColumns}
        isLoading={false}
        onLoad={(tableName) => setSelectedDataset(tableName)}
      />
    </div>
  );
};

export default QueryExport;