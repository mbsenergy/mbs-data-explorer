import React from 'react';
import { Card } from "@/components/ui/card";
import { DatasetOverview } from "./DatasetOverview";
import type { TableInfo } from "./types";

interface DatasetActivityProps {
  favorites: Set<string>;
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
}

export const DatasetActivity = ({ 
  favorites, 
  tables, 
  onPreview, 
  onDownload,
  onToggleFavorite 
}: DatasetActivityProps) => {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Activity</h2>
      <DatasetOverview 
        favorites={favorites} 
        tables={tables} 
        onPreview={onPreview}
        onDownload={onDownload}
        onToggleFavorite={onToggleFavorite}
      />
    </Card>
  );
};