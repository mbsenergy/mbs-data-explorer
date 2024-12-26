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
export type LegendPosition = "top" | "bottom" | "left" | "right";

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

export interface DataControlsProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExecuteQuery: () => void;
  isLoading: boolean;
  selectedTable: string;
}

export interface FilterControlsProps {
  columns: string[];
  filters: Filter[];
  onFilterChange: (filterId: string, field: string, value: any) => void;
  onAddFilter: () => void;
  onRemoveFilter: (filterId: string) => void;
  onApplyFilters: () => void;
  originalCount: number;
  filteredCount: number;
}

export interface Filter {
  id: string;
  searchTerm: string;
  selectedColumn: string;
  operator: "AND" | "OR";
  comparisonOperator: "=" | ">" | "<" | ">=" | "<=" | "!=" | "IN" | "NOT IN" | "LIKE";
}