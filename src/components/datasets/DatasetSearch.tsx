import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import DatasetFilters from "./DatasetFilters";
import { DatasetTable } from "./DatasetTable";
import { DatasetSearchHeader } from "./search/DatasetSearchHeader";
import { DatasetSearchPagination } from "./search/DatasetSearchPagination";
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
  selectedDataset,
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
        <DatasetSearchHeader isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
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
            />
            <DatasetSearchPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};