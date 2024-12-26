import { ColumnDef } from "@tanstack/react-table";
import { SeriesOptionsType } from "highcharts";

export interface DataPoint {
  [key: string]: any;
}

export interface VisualizeState {
  originalData: DataPoint[];
  filteredData: DataPoint[];
  columns: ColumnDef<DataPoint>[];
  isLoading: boolean;
  selectedTable: string;
  showChart: boolean;
  plotData: any[];
  searchTerm: string;
  selectedField: string;
  selectedType: string;
  showOnlyFavorites: boolean;
}

export interface PlotConfig {
  xAxis: string;
  yAxis: string;
  chartType: "scatter" | "bar" | "line" | "box";
  groupBy: string;
  aggregation: "none" | "sum" | "mean" | "max" | "min";
}

export interface ChartSeries extends SeriesOptionsType {
  name?: string;
  type: "scatter" | "column" | "line" | "boxplot";
  data: Array<[number | string, number]> | number[][];
}