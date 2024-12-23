import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import DatasetFilters from "./DatasetFilters";
import { DatasetTable } from "./DatasetTable";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
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
  onLoad?: (tableName: string) => void;
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
  selectedDataset,
  onLoad
}: DatasetSearchProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7;

  // Filter tables to only include those matching XX00_ pattern
  const filteredTables = tables.filter(table => {
    const pattern = /^[A-Z]{2}\d{2}_/;
    return pattern.test(table.tablename);
  });

  const totalPages = Math.ceil(filteredTables.length / rowsPerPage);
  const paginatedTables = filteredTables.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

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
              tables={paginatedTables}
              onPreview={onPreview}
              onDownload={onDownload}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
              favorites={favorites}
              selectedDataset={selectedDataset}
              onLoad={onLoad}
            />
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {Math.max(1, totalPages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};