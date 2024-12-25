import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TableIcon, LineChart } from "lucide-react";
import { DataGrid } from "@/components/datasets/query/DataGrid";
import Plot from 'react-plotly.js';
import type { ColumnDef } from "@tanstack/react-table";

interface DataDisplayProps {
  showChart: boolean;
  plotData: any[];
  plotConfig: {
    xAxis: string;
    yAxis: string;
  };
  filteredData: any[];
  columns: ColumnDef<any>[];
  isLoading: boolean;
}

export const DataDisplay = ({
  showChart,
  plotData,
  plotConfig,
  filteredData,
  columns,
  isLoading
}: DataDisplayProps) => {
  return (
    <Card className="p-6 metallic-card">
      <Tabs defaultValue="plot" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plot" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Plot
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Table
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="plot">
          {showChart && plotData.length > 0 && (
            <Plot
              data={plotData}
              layout={{
                title: `${plotConfig.yAxis} vs ${plotConfig.xAxis}`,
                xaxis: { title: plotConfig.xAxis },
                yaxis: { title: plotConfig.yAxis },
                plot_bgcolor: 'transparent',
                paper_bgcolor: 'transparent',
                font: { color: '#fff' },
                showlegend: true,
                legend: { font: { color: '#fff' } },
                margin: { t: 50, r: 50, b: 50, l: 50 }
              }}
              style={{ width: '100%', height: '600px' }}
              config={{ responsive: true }}
            />
          )}
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
  );
};