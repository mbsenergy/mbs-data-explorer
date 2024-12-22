import React from 'react';
import { Card } from "@/components/ui/card";
import DatasetFilters from "./DatasetFilters";

interface DatasetSearchProps {
  onSearchChange: (search: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  availableFields: string[];
  availableTypes: string[];
}

export const DatasetSearch = ({ 
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
    </Card>
  );
};