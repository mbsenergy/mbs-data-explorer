import { DataGrid } from "@/components/datasets/query/DataGrid";
import { Button } from "@/components/ui/button";
import { Download, ChartBar, Table, FileText, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DatasetActionDialog } from "@/components/datasets/explore/DatasetActionDialog";
import { useState, useEffect, useRef } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Options } from "highcharts";
import { Card } from "@/components/ui/card";
import { DataSummary } from "./DataSummary";
import { useToast } from "@/hooks/use-toast";

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
  const chartRef = useRef<{ chart: Highcharts.Chart } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setChartOptions(plotData);
  }, [plotData, filteredData]);

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleConfirmExport = () => {
    onExport();
    setShowExportDialog(false);
  };

  const exportChartAsHTML = () => {
    if (!chartRef.current?.chart) return;

    const chartSVG = chartRef.current.chart.getSVG();
    const chartCode = `
<!DOCTYPE html>
<html>
<head>
  <title>Chart Export</title>
  <script src="https://code.highcharts.com/highcharts.js"></script>
</head>
<body>
  <div id="container"></div>
  <script>
    const options = ${JSON.stringify(chartOptions, null, 2)};
    Highcharts.chart('container', options);
  </script>
</body>
</html>`;

    const blob = new Blob([chartCode], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart_export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Chart exported as HTML successfully",
    });
  };

  const copyChartCode = () => {
    const chartCode = JSON.stringify(chartOptions, null, 2);
    navigator.clipboard.writeText(chartCode).then(() => {
      toast({
        title: "Success",
        description: "Chart configuration copied to clipboard",
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy chart configuration",
      });
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl metallic-card">
        <Tabs defaultValue="summary" className="w-full">
          <div className="flex justify-between items-center mb-4">
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={!filteredData.length}
                className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                onClick={exportChartAsHTML}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Chart
              </Button>
              <Button
                variant="outline"
                onClick={copyChartCode}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Code className="h-4 w-4 mr-2" />
                Copy Config
              </Button>
            </div>
          </div>

          <TabsContent value="summary">
            <DataSummary data={filteredData} columns={columns} />
          </TabsContent>

          <TabsContent value="plot">
            <div className="w-full h-[600px]">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartRef}
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