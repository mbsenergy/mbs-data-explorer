import { DataGrid } from "@/components/datasets/query/DataGrid";
import { Button } from "@/components/ui/button";
import { Download, ChartBar, Table, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DatasetActionDialog } from "@/components/datasets/explore/DatasetActionDialog";
import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Options } from "highcharts";
import { Card } from "@/components/ui/card";
import { DataSummary } from "./DataSummary";

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
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [chartOptions, setChartOptions] = useState<Options>(plotData);

  useEffect(() => {
    console.log("Filtered data in DataDisplay:", filteredData);
    console.log("Plot data in DataDisplay:", plotData);
    setChartOptions(plotData);
  }, [plotData, filteredData]);

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleConfirmExport = () => {
    onExport();
    setShowExportDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!filteredData.length}
          className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="plot" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Plot
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <DataSummary data={filteredData} columns={columns} />
          </TabsContent>

          <TabsContent value="plot">
            <div className="w-full h-[600px]">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
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
      </Card>

      <DatasetActionDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onConfirm={handleConfirmExport}
        title="Export Data"
        description="Are you sure you want to export this data?"
        actionLabel="Export"
      />
    </div>
  );
};