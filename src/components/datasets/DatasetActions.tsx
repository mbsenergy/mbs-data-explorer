import { PreviewDialog } from "@/components/developer/PreviewDialog";
import { DatasetActivity } from "@/components/datasets/DatasetActivity";
import { DatasetSearch } from "@/components/datasets/DatasetSearch";
import { DatasetExplore } from "@/components/datasets/explore/DatasetExplore";
import type { TableInfo } from "@/components/datasets/types";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetActionsProps {
  tables: TableInfo[];
  filteredTables: TableInfo[];
  favorites: Set<string>;
  selectedDataset: TableNames | null;
  selectedColumns: string[];
  previewData: { tableName: string; data: string } | null;
  availableFields: string[];
  availableTypes: string[];
  searchTerm: string;
  selectedField: string;
  selectedType: string;
  showOnlyFavorites: boolean;
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  onSearchChange: (term: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  onFavoriteChange: (show: boolean) => void;
  onColumnsChange: (columns: string[]) => void;
  onLoad: (tableName: string) => void;
  onClosePreview: () => void;
}

export const DatasetActions = ({
  tables,
  filteredTables,
  favorites,
  selectedDataset,
  selectedColumns,
  previewData,
  availableFields,
  availableTypes,
  searchTerm,
  selectedField,
  selectedType,
  showOnlyFavorites,
  onPreview,
  onDownload,
  onSelect,
  onToggleFavorite,
  onSearchChange,
  onFieldChange,
  onTypeChange,
  onFavoriteChange,
  onColumnsChange,
  onLoad,
  onClosePreview,
}: DatasetActionsProps) => {
  return (
    <div className="space-y-6">
      <DatasetActivity 
        favorites={favorites}
        tables={tables}
        selectedDataset={selectedDataset}
        onPreview={onPreview}
        onDownload={onDownload}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />

      <DatasetSearch
        tables={filteredTables}
        onPreview={onPreview}
        onDownload={onDownload}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        onSearchChange={onSearchChange}
        onFieldChange={onFieldChange}
        onTypeChange={onTypeChange}
        onFavoriteChange={onFavoriteChange}
        availableFields={availableFields}
        availableTypes={availableTypes}
        selectedDataset={selectedDataset || ""}
        onLoad={onLoad}
      />

      <DatasetExplore 
        selectedDataset={selectedDataset} 
        onColumnsChange={onColumnsChange}
        onLoad={onLoad}
      />

      {previewData && (
        <PreviewDialog
          isOpen={!!previewData}
          onClose={onClosePreview}
          filePath=""
          fileName={previewData.tableName}
          section="datasets"
          directData={previewData.data}
        />
      )}
    </div>
  );
};