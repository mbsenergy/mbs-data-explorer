import { DataPoint, PlotConfig } from "@/types/visualize";
import type { Options, SeriesOptionsType } from "highcharts";
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
  const getSeriesData = (): SeriesOptionsType[] => {
    if (plotConfig.groupBy) {
      const groups = filteredData.reduce((acc, item) => {
        const group = item[plotConfig.groupBy];
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {} as Record<string, DataPoint[]>);

      return Object.entries(groups).map(([group, items]): SeriesOptionsType => {
        const xValues = items.map(item => item[plotConfig.xAxis]);
        const yValues = items.map(item => Number(item[plotConfig.yAxis]));
        const type = getSeriesType(plotConfig.chartType);

        if (plotConfig.aggregation !== 'none') {
          const aggregatedValue = aggregateValues(yValues, plotConfig.aggregation)[0];
          return {
            name: group,
            type,
            data: [[xValues[0], aggregatedValue]]
          };
        }

        return {
          name: group,
          type,
          data: xValues.map((x, i) => [x, yValues[i]])
        };
      });
    }

    const xValues = filteredData.map(item => item[plotConfig.xAxis]);
    const yValues = filteredData.map(item => Number(item[plotConfig.yAxis]));
    const type = getSeriesType(plotConfig.chartType);

    if (plotConfig.aggregation !== 'none') {
      const aggregatedValue = aggregateValues(yValues, plotConfig.aggregation)[0];
      return [{
        type,
        data: [[xValues[0], aggregatedValue]]
      }];
    }

    return [{
      type,
      data: xValues.map((x, i) => [x, yValues[i]])
    }];
  };

  return {
    title: {
      text: `${plotConfig.yAxis} vs ${plotConfig.xAxis}`
    },
    xAxis: {
      title: {
        text: plotConfig.xAxis
      }
    },
    yAxis: {
      title: {
        text: plotConfig.yAxis
      }
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
      }
    }
  };
};