import { Toggle } from "@/components/ui/toggle";

interface FileTypeToggleProps {
  fileType: 'excel' | 'csv';
  onTypeChange: (type: 'excel' | 'csv') => void;
}

export const FileTypeToggle = ({ fileType, onTypeChange }: FileTypeToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-secondary/20 rounded-lg p-1">
      <Toggle
        pressed={fileType === 'excel'}
        onPressedChange={() => onTypeChange('excel')}
        className="text-xs data-[state=on]:bg-primary h-7"
      >
        Excel
      </Toggle>
      <Toggle
        pressed={fileType === 'csv'}
        onPressedChange={() => onTypeChange('csv')}
        className="text-xs data-[state=on]:bg-primary h-7"
      >
        CSV
      </Toggle>
    </div>
  );
};