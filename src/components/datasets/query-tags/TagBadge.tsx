import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface TagBadgeProps {
  tag: string;
  onRemove: (tag: string) => void;
}

export const TagBadge = ({ tag, onRemove }: TagBadgeProps) => {
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Tag className="h-3 w-3" />
      {tag}
      <button
        onClick={() => onRemove(tag)}
        className="ml-1 hover:text-destructive"
      >
        ×
      </button>
    </Badge>
  );
};