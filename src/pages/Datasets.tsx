import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Download, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import DatasetFilters from "@/components/datasets/DatasetFilters";
import SqlEditor from "@/components/datasets/SqlEditor";

type TableInfo = {
  tablename: string;
};

const Datasets = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [customQuery, setCustomQuery] = useState<string | null>(null);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const { data: tableData, isLoading: dataLoading } = useQuery({
    queryKey: ["table-data", selectedTable, filters, customQuery],
    queryFn: async () => {
      if (!selectedTable) return null;

      let query = supabase.from(selectedTable as any).select("*");

      if (customQuery) {
        toast({
          title: "Custom SQL queries",
          description: "Custom SQL query execution is not yet implemented for security reasons.",
        });
        return null;
      }

      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          query = query.ilike(column, `%${value}%`);
        }
      });

      const { data, error } = await query.limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTable,
  });

  const filteredTables = tables?.filter((table) =>
    table.tablename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const trackDownload = async () => {
    if (!user?.id || !selectedTable) return;

    console.log("Tracking download for user:", user.id, "table:", selectedTable);
    
    const { error } = await supabase
      .from("analytics")
      .insert({
        user_id: user.id,
        dataset_name: selectedTable,
        is_custom_query: !!customQuery,
      });

    if (error) {
      console.error("Error tracking download:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to track download activity.",
      });
    } else {
      console.log("Download tracked successfully");
    }
  };

  const handleDownload = async () => {
    if (!tableData) return;
    
    // Track the download
    await trackDownload();
    
    const csv = tableData.map((row) => 
      Object.values(row).join(',')
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable}.csv`;
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
      <Card className="p-6 glass-panel">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={handleDownload} disabled={!selectedTable || !tableData}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          <Card className="p-4 glass-panel">
            <h3 className="font-semibold mb-4">Available Datasets</h3>
            {tablesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTables?.map((table) => (
                  <Button
                    key={table.tablename}
                    variant={selectedTable === table.tablename ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedTable(table.tablename);
                      setFilters({});
                      setCustomQuery(null);
                    }}
                  >
                    {table.tablename}
                  </Button>
                ))}
              </div>
            )}
          </Card>

          <div className="space-y-6">
            {selectedTable && (
              <>
                <Card className="p-4 glass-panel">
                  <DatasetFilters
                    columns={tableData?.[0] ? Object.keys(tableData[0]) : []}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </Card>

                <Card className="p-4 glass-panel">
                  <SqlEditor onExecute={setCustomQuery} />
                </Card>
              </>
            )}

            <Card className="p-4 glass-panel">
              <h3 className="font-semibold mb-4">Preview</h3>
              {dataLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : tableData ? (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(tableData[0] || {}).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((row, i) => (
                        <TableRow key={i}>
                          {Object.values(row).map((value: any, j) => (
                            <TableCell key={j}>
                              {typeof value === "object" ? JSON.stringify(value) : value}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a dataset to preview its data
                </p>
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Datasets;