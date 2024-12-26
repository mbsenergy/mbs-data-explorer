import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export const TagInput = ({ value, onChange, onAdd }: TagInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add tag..."
        className="h-7 w-24"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onAdd();
          }
        }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="h-7"
      >
        Add
      </Button>
    </div>
  );
};