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
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Datasets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .neq("table_name", "profiles");

      if (error) throw error;
      return data;
    },
  });

  const { data: tableData, isLoading: dataLoading } = useQuery({
    queryKey: ["table-data", selectedTable],
    queryFn: async () => {
      if (!selectedTable) return null;
      const { data, error } = await supabase
        .from(selectedTable)
        .select("*")
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTable,
  });

  const filteredTables = tables?.filter((table) =>
    table.table_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button variant="outline" disabled={!selectedTable}>
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
                    key={table.table_name}
                    variant={selectedTable === table.table_name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTable(table.table_name)}
                  >
                    {table.table_name}
                  </Button>
                ))}
              </div>
            )}
          </Card>

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
      </Card>
    </div>
  );
};

export default Datasets;