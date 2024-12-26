import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartTypeSelector } from "./chart-controls/ChartTypeSelector";
import { ChartOptionsSelector } from "./chart-controls/ChartOptionsSelector";
import { AxisSelector } from "./chart-controls/AxisSelector";
import { useState } from "react";
import type { ChartControlsProps } from "@/types/visualize";

export const ChartControls = ({
  columns,
  plotConfig,
  onConfigChange,
  onGenerateChart
}: ChartControlsProps) => {
  const [chartOptions, setChartOptions] = useState({
    showLegend: true,
    legendPosition: 'bottom' as const,
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

  const handleChartOptionChange = (key: string, value: any) => {
    setChartOptions(prev => ({ ...prev, [key]: value }));
    // Update Highcharts options based on the changes
    onConfigChange({
      ...plotConfig,
      chartOptions: {
        ...plotConfig.chartOptions,
        [key]: value,
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
          align: chartOptions.legendPosition === 'right' ? 'right' : 'center',
          verticalAlign: chartOptions.legendPosition === 'bottom' ? 'bottom' : 'top',
          layout: chartOptions.legendPosition === 'right' ? 'vertical' : 'horizontal'
        },
        chart: {
          zoomType: chartOptions.enableZoom ? 'xy' : undefined
        }
      }
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
        <ChartTypeSelector
          value={plotConfig.chartType}
          onChange={(type) => onConfigChange({ ...plotConfig, chartType: type })}
        />
      </Card>

      <Card className="p-6">
        <AxisSelector
          columns={columns}
          config={axisConfig}
          onChange={handleAxisConfigChange}
        />
      </Card>

      <Card className="p-6">
        <ChartOptionsSelector
          options={chartOptions}
          onChange={handleChartOptionChange}
        />
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