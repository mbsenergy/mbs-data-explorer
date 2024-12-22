import React from 'react';
import { Card } from "@/components/ui/card";
import DatasetFilters from "./DatasetFilters";
import { DatasetTable } from "./DatasetTable";
import type { TableInfo } from "./types";

interface DatasetSearchProps {
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  favorites: Set<string>;
  onSearchChange: (search: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  availableFields: string[];
  availableTypes: string[];
}

export const DatasetSearch = ({ 
  tables,
  onPreview,
  onDownload,
  onSelect,
  onToggleFavorite,
  favorites,
  onSearchChange,
  onFieldChange,
  onTypeChange,
  availableFields,
  availableTypes
}: DatasetSearchProps) => {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Search on datamart</h2>
      <DatasetFilters
        onSearchChange={onSearchChange}
        onFieldChange={onFieldChange}
        onTypeChange={onTypeChange}
        availableFields={availableFields}
        availableTypes={availableTypes}
      />
      <div className="mt-6">
        <DatasetTable
          tables={tables}
          onPreview={onPreview}
          onDownload={onDownload}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
        />
      </div>
    </Card>
  );
};