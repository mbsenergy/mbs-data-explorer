import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DatamartSearch } from "@/components/visualize/DatamartSearch";
import { DataDisplay } from "@/components/visualize/DataDisplay";
import type { ColumnDef } from "@tanstack/react-table";
import type { TableInfo } from "@/components/datasets/types";

const chartTypes = ["line", "bar", "scatter"] as const;
type ChartType = typeof chartTypes[number];

export const Visualize = () => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("line");
  const [selectedDataset, setSelectedDataset] = useState<TableInfo | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      header: "Date",
      accessorFn: (row) => row.DATE,
    },
    {
      header: "Value",
      accessorFn: (row) => row.VALUE,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Visualize Data</h1>
      <Tabs defaultValue="datamart" className="space-y-6">
        <TabsList>
          <TabsTrigger value="datamart">Datamart</TabsTrigger>
          <TabsTrigger value="data-display">Data Display</TabsTrigger>
        </TabsList>
        <TabsContent value="datamart">
          <Collapsible>
            <CollapsibleTrigger>
              <Button variant="outline" className="w-full">
                Select Dataset
                <ChevronDown className="ml-2" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <DatamartSearch
                tables={tables || []}
                onSelect={(table) => setSelectedDataset(table)}
              />
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>
        <TabsContent value="data-display">
          <DataDisplay
            dataset={selectedDataset}
            selectedColumns={selectedColumns}
            chartType={selectedChartType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
