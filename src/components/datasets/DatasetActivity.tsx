import React from 'react';
import { Card } from "@/components/ui/card";
import { DatasetOverview } from "./DatasetOverview";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TableInfo, TableNames } from "./types";

interface DatasetActivityProps {
  favorites: Set<string>;
  tables: TableInfo[];
  selectedDataset: TableNames | null;
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
}

export const DatasetActivity = ({ 
  favorites, 
  tables, 
  selectedDataset,
  onPreview, 
  onDownload,
  onSelect,
  onToggleFavorite 
}: DatasetActivityProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Card className="p-6 mb-6 metallic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Activity</h2>
          </div>
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
          <DatasetOverview 
            favorites={favorites} 
            tables={tables}
            selectedDataset={selectedDataset as string}
            onPreview={onPreview}
            onDownload={onDownload}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};