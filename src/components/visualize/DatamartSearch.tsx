import { useState } from "react";
import { Search, FileSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DatasetTable } from "@/components/datasets/DatasetTable";
import type { TableInfo } from "@/components/datasets/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DatamartSearchProps {
  tables: TableInfo[];
  filteredTables: TableInfo[];
  favorites: Set<string>;
  selectedDataset?: string;
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  onSearchChange: (term: string) => void;
  onFieldChange: (field: string) => void;
  onTypeChange: (type: string) => void;
  onFavoriteChange: (show: boolean) => void;
  availableFields: string[];
  availableTypes: string[];
}

export const DatamartSearch = ({
  tables,
  filteredTables,
  favorites,
  selectedDataset,
  onPreview,
  onDownload,
  onSelect,
  onToggleFavorite,
  onSearchChange,
  onFieldChange,
  onTypeChange,
  onFavoriteChange,
}: DatamartSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Fixed values for fields and types
  const fields = ["EC", "ME", "MS", "TS"];
  const types = ["01", "02", "03"];

  const handlePreview = async (tableName: string) => {
    try {
      const { data: queryResult, error } = await supabase.rpc('execute_query', {
        query_text: `SELECT * FROM "${tableName}" LIMIT 30`
      });

      if (error) {
        throw error;
      }

      if (queryResult && Array.isArray(queryResult)) {
        const previewData = JSON.stringify(queryResult.slice(0, 30), null, 2);
        onPreview(tableName);
      }
    } catch (error: any) {
      console.error("Error previewing dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to preview dataset."
      });
    }
  };

  return (
    <Card className="p-6 metallic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Datamart Search</h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search datasets..."
                  className="pl-10"
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <Select onValueChange={onFieldChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All fields</SelectItem>
                  {fields.map((field) => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={onTypeChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="favorite-filter" onCheckedChange={onFavoriteChange} />
              <Label htmlFor="favorite-filter">Show only favorites</Label>
            </div>
            <DatasetTable
              tables={filteredTables}
              onPreview={handlePreview}
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