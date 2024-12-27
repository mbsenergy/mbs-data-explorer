import { DataGrid } from "@/components/datasets/query/DataGrid";
import { Button } from "@/components/ui/button";
import { Download, ChartBar, Table, FileText, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DatasetActionDialog } from "@/components/datasets/explore/DatasetActionDialog";
import { useState, useRef } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Options } from "highcharts";
import { Card } from "@/components/ui/card";
import { DataSummary } from "./DataSummary";
import { useToast } from "@/hooks/use-toast";
import theme from "@/integrations/highcharts/highchartsConfig";
import { CodeSnippetModal } from "./code-display/CodeSnippetModal";

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
  const [showCodeModal, setShowCodeModal] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { toast } = useToast();

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleConfirmExport = () => {
    onExport();
    setShowExportDialog(false);
  };

  const exportChartAsHTML = () => {
    if (!chartRef.current?.chart) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Chart is not ready for export",
      });
      return;
    }

    requestAnimationFrame(() => {
      const svg = chartRef.current?.chart.container.innerHTML;
      const chartCode = `
<!DOCTYPE html>
<html>
<head>
  <title>Chart Export</title>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <style>
    body { margin: 0; padding: 20px; background: #1a1a1a; color: white; }
    #container { width: 100%; height: 600px; }
  </style>
</head>
<body>
  <div id="container">${svg}</div>
  <script>
    // Apply the theme
    const theme = ${JSON.stringify(theme, null, 2)};
    Highcharts.setOptions(theme);
    
    // Create the chart
    const options = ${JSON.stringify(plotData, null, 2)};
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
                onClick={() => setShowCodeModal(true)}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Code className="h-4 w-4 mr-2" />
                Show Code
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
                options={plotData}
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

      <CodeSnippetModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        plotData={plotData}
      />
    </div>
  );
};