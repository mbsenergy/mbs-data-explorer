import type { ColumnDef } from "@tanstack/react-table";
import type { Database } from "@/integrations/supabase/types";

export interface TableInfo {
  tablename: string;
}

export interface DatasetFiltersProps {
  onSearchChange: (search: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  onFavoriteChange: (showFavorites: boolean) => void;
  availableFields: string[];
  availableTypes: string[];
}

export interface DataGridProps {
  data: any[];
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  style?: React.CSSProperties;
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

export interface DatasetQueryProps {
  selectedDataset: TableNames | null;
  selectedColumns: string[];
}

export type TableNames = keyof Database['public']['Tables'];