import { ColumnDef } from "@tanstack/react-table";
import { Options } from "highcharts";

export type DataPoint = Record<string, any>;

export interface VisualizeState {
  originalData: DataPoint[];
  filteredData: DataPoint[];
  columns: ColumnDef<DataPoint>[];
  isLoading: boolean;
  selectedTable: string;
  showChart: boolean;
  plotData: Options;
  searchTerm: string;
  selectedField: string;
  selectedType: string;
  showOnlyFavorites: boolean;
}

export type ChartType = "scatter" | "bar" | "line" | "box" | "area" | "bubble";
export type AggregationType = "none" | "sum" | "mean" | "max" | "min";

export interface PlotConfig {
  xAxis: string;
  yAxis: string;
  chartType: ChartType;
  groupBy: string;
  aggregation: AggregationType;
  chartOptions?: Partial<Options>;
}

export interface ChartControlsProps {
  columns: ColumnDef<DataPoint>[];
  plotConfig: PlotConfig;
  onConfigChange: (config: PlotConfig) => void;
  onGenerateChart: () => void;
}