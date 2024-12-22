import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface DeveloperSearchProps {
  onSearchChange: (search: string) => void;
  onTagChange: (tag: string) => void;
  onFavoriteChange: (showFavorites: boolean) => void;
  availableTags: string[];
}

export const DeveloperSearch = ({ 
  onSearchChange, 
  onTagChange, 
  onFavoriteChange,
  availableTags 
}: DeveloperSearchProps) => {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Search material</h2>
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
    </Card>
  );
};