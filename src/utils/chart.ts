import { DataPoint, PlotConfig } from "@/types/visualize";
import type { Options, SeriesOptionsType, AxisTypeValue } from "highcharts";
import type { ChartSeriesData } from "@/types/dataset";

export const aggregateValues = (values: number[], aggregation: string): number[] => {
  switch (aggregation) {
    case 'sum':
      return [values.reduce((a, b) => a + b, 0)];
    case 'mean':
      return [values.reduce((a, b) => a + b, 0) / values.length];
    case 'max':
      return [Math.max(...values)];
    case 'min':
      return [Math.min(...values)];
    default:
      return values;
  }
};

export const getSeriesType = (chartType: string): "scatter" | "column" | "line" | "boxplot" => {
  switch (chartType) {
    case 'bar':
      return 'column';
    case 'box':
      return 'boxplot';
    case 'line':
      return 'line';
    default:
      return 'scatter';
  }
};

export const generateChartOptions = (
  filteredData: DataPoint[],
  plotConfig: PlotConfig
): Options => {
  console.log("Generating chart with data:", filteredData);
  console.log("Plot config:", plotConfig);

  const getSeriesData = (): SeriesOptionsType[] => {
    if (plotConfig.groupBy) {
      // Group data by the groupBy field
      const groups = filteredData.reduce((acc, item) => {
        const group = item[plotConfig.groupBy];
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {} as Record<string, DataPoint[]>);

      return Object.entries(groups).map(([group, items]): SeriesOptionsType => {
        // For each group, create a series
        const data = items.map(item => {
          const xValue = plotConfig.xAxisType === 'datetime' 
            ? new Date(item[plotConfig.xAxis]).getTime()
            : item[plotConfig.xAxis];
          const yValue = Number(item[plotConfig.yAxis]);
          return [xValue, yValue];
        }).sort((a, b) => (a[0] as number) - (b[0] as number)); // Sort by x value

        const type = getSeriesType(plotConfig.chartType);

        if (plotConfig.aggregation !== 'none') {
          const yValues = items.map(item => Number(item[plotConfig.yAxis]));
          const aggregatedValue = aggregateValues(yValues, plotConfig.aggregation)[0];
          return {
            name: group,
            type,
            data: [[items[0][plotConfig.xAxis], aggregatedValue]]
          };
        }

        return {
          name: group,
          type,
          data
        };
      });
    }

    // If no grouping, create a single series
    const data = filteredData.map(item => {
      const xValue = plotConfig.xAxisType === 'datetime' 
        ? new Date(item[plotConfig.xAxis]).getTime()
        : item[plotConfig.xAxis];
      const yValue = Number(item[plotConfig.yAxis]);
      return [xValue, yValue];
    }).sort((a, b) => (a[0] as number) - (b[0] as number)); // Sort by x value

    const type = getSeriesType(plotConfig.chartType);

    if (plotConfig.aggregation !== 'none') {
      const yValues = filteredData.map(item => Number(item[plotConfig.yAxis]));
      const aggregatedValue = aggregateValues(yValues, plotConfig.aggregation)[0];
      return [{
        type,
        data: [[filteredData[0][plotConfig.xAxis], aggregatedValue]]
      }];
    }

    return [{
      type,
      data
    }];
  };

  const getAxisType = (dataType: string): AxisTypeValue => {
    switch (dataType) {
      case 'datetime':
        return 'datetime';
      case 'category':
        return 'category';
      default:
        return 'linear';
    }
  };

  const xAxisConfig = {
    type: getAxisType(plotConfig.xAxisType),
    title: {
      text: plotConfig.xAxis
    }
  };

  return {
    title: {
      text: `${plotConfig.yAxis} vs ${plotConfig.xAxis}`
    },
    xAxis: xAxisConfig,
    yAxis: {
      title: {
        text: plotConfig.yAxis
      },
      type: plotConfig.yAxisType === 'numeric' ? 'linear' : getAxisType(plotConfig.yAxisType)
    },
    series: getSeriesData(),
    plotOptions: {
      scatter: {
        marker: {
          radius: 4
        }
      },
      column: {
        borderRadius: 5
      },
      series: {
        animation: {
          duration: 1000
        },
        dataLabels: {
          enabled: false
        },
        marker: {
          enabled: true
        }
      }
    },
    tooltip: {
      formatter: function(this: any) {
        if (!this.point) return '';
        
        const x = plotConfig.xAxisType === 'datetime' 
          ? new Date(this.point.x as number).toLocaleDateString()
          : this.point.x;
        return `<b>${this.series.name || ''}</b><br/>
                ${plotConfig.xAxis}: ${x}<br/>
                ${plotConfig.yAxis}: ${this.point.y}`;
      }
    }
  };
};
