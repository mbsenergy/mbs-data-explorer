import React from 'react';
import { Card } from "@/components/ui/card";
import { DatasetTable } from "./DatasetTable";
import type { TableInfo } from "./types";

interface DatasetExploreProps {
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  favorites: Set<string>;
}

export const DatasetExplore = ({ 
  tables,
  onPreview,
  onDownload,
  onSelect,
  onToggleFavorite,
  favorites
}: DatasetExploreProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Explore</h2>
      <DatasetTable
        tables={tables}
        onPreview={onPreview}
        onDownload={onDownload}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
      />
    </Card>
  );
};