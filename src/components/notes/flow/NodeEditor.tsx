import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2 } from 'lucide-react';
import { Panel } from '@xyflow/react';

interface NodeEditorProps {
  editLabel: string;
  onEditLabelChange: (value: string) => void;
  onUpdateLabel: () => void;
}

export const NodeEditor = ({
  editLabel,
  onEditLabelChange,
  onUpdateLabel,
}: NodeEditorProps) => {
  return (
    <Panel position="top-left" className="flex gap-2 bg-background/50 p-2 rounded-lg">
      <Input
        value={editLabel}
        onChange={(e) => onEditLabelChange(e.target.value)}
        placeholder="Node label"
        className="w-48"
      />
      <Button 
        onClick={onUpdateLabel}
        variant="outline"
        className="gap-2"
      >
        <Edit2 className="h-4 w-4" />
        Update
      </Button>
    </Panel>
  );
};