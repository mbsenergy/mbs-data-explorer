import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChartBar, Table } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DataGrid } from "@/components/datasets/query/DataGrid";
import type { ColumnDef } from "@tanstack/react-table";
import type { Options } from "highcharts";

interface DataDisplayProps {
  plotData: Options;
  filteredData: any[];
  columns: ColumnDef<any>[];
  isLoading: boolean;
  onExport: () => void;
}

export const DataDisplay = ({
  plotData,
  filteredData,
  columns,
  isLoading,
  onExport
}: DataDisplayProps) => {
  return (
    <Card className="p-6 metallic-card">
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="plot" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="plot" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                Plot
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
            <Button
              onClick={onExport}
              disabled={!filteredData.length}
              className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <TabsContent value="plot">
            <div className="w-full h-[600px]">
              <HighchartsReact
                highcharts={Highcharts}
                options={plotData}
                containerProps={{ style: { height: '100%' } }}
              />
            </div>
          </TabsContent>

          <TabsContent value="table">
            <DataGrid
              data={filteredData}
              columns={columns}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};