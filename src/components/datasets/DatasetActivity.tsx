import React from 'react';
import { Card } from "@/components/ui/card";
import { DatasetOverview } from "./DatasetOverview";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Card className="p-6 mb-6 metallic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Activity</h2>
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
            onPreview={onPreview}
            onDownload={onDownload}
            onToggleFavorite={onToggleFavorite}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};