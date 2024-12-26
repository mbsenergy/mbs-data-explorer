import { ColumnDef } from "@tanstack/react-table";
import { Options } from "highcharts";
import type { ComparisonOperator } from "@/components/datasets/explore/types";

export type DataPoint = Record<string, any>;

export interface VisualizeState {
  originalData: DataPoint[];
  filteredData: DataPoint[];
  columns: (ColumnDef<DataPoint> & { show?: boolean })[];
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
export type LegendPosition = "top" | "bottom" | "left" | "right";
export type AxisDataType = "auto" | "numeric" | "datetime" | "category";

export interface PlotConfig {
  xAxis: string;
  yAxis: string;
  chartType: ChartType;
  groupBy: string;
  aggregation: AggregationType;
  xAxisType: AxisDataType;
  yAxisType: AxisDataType;
  chartOptions?: Partial<Options>;
}

export interface ChartControlsProps {
  columns: ColumnDef<DataPoint>[];
  plotConfig: PlotConfig;
  onConfigChange: (config: PlotConfig) => void;
  onGenerateChart: () => void;
}

export interface DataControlsProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExecuteQuery: (query: string) => void;
  isLoading: boolean;
  selectedTable: string;
}

export interface Filter {
  id: string;
  searchTerm: string;
  selectedColumn: string;
  operator: "AND" | "OR";
  comparisonOperator: ComparisonOperator;
}

export interface FilterControlsProps {
  columns: string[];
  filters: Filter[];
  onFilterChange: (filterId: string, field: keyof Filter, value: string | ComparisonOperator) => void;
  onAddFilter: () => void;
  onRemoveFilter: (filterId: string) => void;
  onApplyFilters: () => void;
  originalCount: number;
  filteredCount: number;
}
