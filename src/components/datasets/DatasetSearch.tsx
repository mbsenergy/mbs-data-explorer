import React from 'react';
import { Card } from "@/components/ui/card";
import DatasetFilters from "./DatasetFilters";
import { DatasetTable } from "./DatasetTable";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onFavoriteChange: (showFavorites: boolean) => void;
  availableFields: string[];
  availableTypes: string[];
  selectedDataset?: string;
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
  onFavoriteChange,
  availableFields,
  availableTypes,
  selectedDataset
}: DatasetSearchProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  React.useEffect(() => {
    const handleSelectDataset = (event: CustomEvent<string>) => {
      onSelect(event.detail);
    };

    window.addEventListener('select-dataset', handleSelectDataset as EventListener);
    
    return () => {
      window.removeEventListener('select-dataset', handleSelectDataset as EventListener);
    };
  }, [onSelect]);

  return (
    <Card className="p-6 mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Search on datamart</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <DatasetFilters
            onSearchChange={onSearchChange}
            onFieldChange={onFieldChange}
            onTypeChange={onTypeChange}
            onFavoriteChange={onFavoriteChange}
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
              selectedDataset={selectedDataset}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};