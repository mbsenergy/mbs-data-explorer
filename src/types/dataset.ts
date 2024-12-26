import type { ColumnDef } from "@tanstack/react-table";
import type { SeriesOptionsType } from "highcharts";

export interface DataGridProps {
  data: any[];
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  style?: React.CSSProperties;
}

export interface DatasetFiltersProps {
  columns: string[];
  searchTerm: string;
  selectedColumn: string;
  onSearchChange: (value: string) => void;
  onColumnChange: (value: string) => void;
  availableFields: string[];
  availableTypes: string[];
}

export interface DatasetSearchProps {
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  favorites: Set<string>;
  onSearchChange: (search: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  onFavoriteChange: (showFavorites: boolean) => void;
  availableFields: string[];
  availableTypes: string[];
  selectedDataset: string;
  onLoad?: (tableName: string) => void;
}

export interface TableInfo {
  tablename: string;
}

export type ChartSeriesData = {
  name?: string;
  type: 'scatter' | 'column' | 'line' | 'boxplot';
  data: (number | [number | string, number])[];
}

export interface ChartOptions {
  title: {
    text: string;
  };
  xAxis: {
    title: {
      text: string;
    };
  };
  yAxis: {
    title: {
      text: string;
    };
  };
  series: SeriesOptionsType[];
  plotOptions?: {
    scatter?: {
      marker?: {
        radius?: number;
      };
    };
    column?: {
      borderRadius?: number;
    };
  };
}