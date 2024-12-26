import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartTypeSelector } from "./chart-controls/ChartTypeSelector";
import { ChartOptionsSelector } from "./chart-controls/ChartOptionsSelector";
import { AxisSelector } from "./chart-controls/AxisSelector";
import { useState } from "react";
import type { ChartControlsProps, LegendPosition } from "@/types/visualize";
import type { Options } from "highcharts";

interface ChartOptions {
  showLegend: boolean;
  legendPosition: LegendPosition;
  enableZoom: boolean;
  enableAnimation: boolean;
  opacity: number;
  markerSize: number;
}

export const ChartControls = ({
  columns,
  plotConfig,
  onConfigChange,
  onGenerateChart
}: ChartControlsProps) => {
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    showLegend: true,
    legendPosition: 'bottom',
    enableZoom: false,
    enableAnimation: true,
    opacity: 100,
    markerSize: 4
  });

  const [axisConfig, setAxisConfig] = useState({
    xAxis: plotConfig.xAxis,
    yAxis: plotConfig.yAxis,
    groupBy: plotConfig.groupBy,
    xAxisLabel: '',
    yAxisLabel: '',
    reverseAxis: false,
    logScale: false
  });

  const handleChartOptionChange = (key: keyof ChartOptions, value: any) => {
    setChartOptions(prev => ({ ...prev, [key]: value }));
    
    const legendAlign = value === 'right' ? 'right' : 'center';
    const verticalAlign = value === 'bottom' ? 'bottom' : 'top';
    const layout = value === 'right' ? 'vertical' : 'horizontal';

    const chartConfig: Partial<Options> = {
      plotOptions: {
        series: {
          animation: chartOptions.enableAnimation,
          marker: {
            radius: chartOptions.markerSize
          }
        }
      },
      legend: {
        enabled: chartOptions.showLegend,
        align: legendAlign,
        verticalAlign: verticalAlign,
        layout: layout
      },
      chart: {
        zooming: {
          type: chartOptions.enableZoom ? 'xy' : 'none'
        }
      }
    };

    onConfigChange({
      ...plotConfig,
      chartOptions: chartConfig
    });
  };

  const handleAxisConfigChange = (key: string, value: any) => {
    setAxisConfig(prev => ({ ...prev, [key]: value }));
    if (['xAxis', 'yAxis', 'groupBy'].includes(key)) {
      onConfigChange({
        ...plotConfig,
        [key]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Tabs defaultValue="type" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="type">Chart Type</TabsTrigger>
            <TabsTrigger value="axis">Axis</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="type" className="mt-4">
            <ChartTypeSelector
              value={plotConfig.chartType}
              onChange={(type) => onConfigChange({ ...plotConfig, chartType: type })}
            />
          </TabsContent>

          <TabsContent value="axis" className="mt-4">
            <AxisSelector
              columns={columns}
              config={axisConfig}
              onChange={handleAxisConfigChange}
            />
          </TabsContent>

          <TabsContent value="options" className="mt-4">
            <ChartOptionsSelector
              options={chartOptions}
              onChange={handleChartOptionChange}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button
          onClick={onGenerateChart}
          disabled={!plotConfig.xAxis || !plotConfig.yAxis}
          className="bg-[#e11d48] hover:bg-[#be123c] text-white disabled:opacity-50"
        >
          Generate Chart
        </Button>
      </div>
    </div>
  );
};