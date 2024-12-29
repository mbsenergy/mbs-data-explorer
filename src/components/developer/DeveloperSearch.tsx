import { useState } from "react";
import { Search, FileSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DeveloperSearchProps {
  onSearchChange: (search: string) => void;
  onTagChange: (tag: string) => void;
  onFavoriteChange: (showFavorites: boolean) => void;
  availableTags: string[];
  title?: string;
}

export const DeveloperSearch = ({ 
  onSearchChange, 
  onTagChange, 
  onFavoriteChange,
  availableTags,
  title = "Search Material"
}: DeveloperSearchProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="p-6 mb-6 metallic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSearch className="h-6 w-6" />
            <h2 className="text-xl font-semibold">{title}</h2>
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
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  className="pl-10"
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <Select onValueChange={onTagChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="favorite-filter" onCheckedChange={onFavoriteChange} />
              <Label htmlFor="favorite-filter">Show only favorites</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};