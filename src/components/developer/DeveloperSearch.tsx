import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeveloperSearchProps {
  onSearchChange: (search: string) => void;
  onTagChange: (tag: string) => void;
  availableTags: string[];
}

export const DeveloperSearch = ({ onSearchChange, onTagChange, availableTags }: DeveloperSearchProps) => {
  return (
    <div className="flex gap-4 items-center mb-8">
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
  );
};