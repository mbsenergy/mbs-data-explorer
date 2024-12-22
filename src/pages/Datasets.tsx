import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import DatasetFilters from "@/components/datasets/DatasetFilters";

type TableInfo = {
  tablename: string;
};

const Datasets = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  // Extract unique fields from table names
  useEffect(() => {
    if (tables) {
      const fields = [...new Set(tables.map(table => {
        const match = table.tablename.match(/^([A-Z]{2})\d+_/);
        return match ? match[1] : null;
      }).filter(Boolean))];
      setAvailableFields(fields as string[]);
    }
  }, [tables]);

  // Filter tables based on search term and selected field
  const filteredTables = tables?.filter(table => {
    const matchesSearch = table.tablename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "all" || table.tablename.startsWith(selectedField);
    return matchesSearch && matchesField;
  });

  const handleDownload = async (tableName: string) => {
    if (!user?.id) return;

    // Track the download
    const { error: analyticsError } = await supabase
      .from("analytics")
      .insert({
        user_id: user.id,
        dataset_name: tableName,
        is_custom_query: false,
      });

    if (analyticsError) {
      console.error("Error tracking download:", analyticsError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to track download activity.",
      });
      return;
    }

    // Fetch the data
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(1000);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download dataset.",
      });
      return;
    }

    // Convert to CSV and download
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Dataset downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Datasets</h1>
      
      <Card className="p-6">
        <DatasetFilters
          onSearchChange={setSearchTerm}
          onFieldChange={setSelectedField}
          availableFields={availableFields}
        />

        {tablesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset Name</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables?.map((table) => {
                  const match = table.tablename.match(/^([A-Z]{2})(\d+)_(.+)/);
                  const [_, field, type, name] = match || ["", "", "", table.tablename];
                  
                  return (
                    <TableRow key={table.tablename}>
                      <TableCell>{name}</TableCell>
                      <TableCell>{field}</TableCell>
                      <TableCell>{type}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(table.tablename)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Datasets;