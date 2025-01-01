import { Button } from '@/components/ui/button';
import { Sun, Moon, Download, Plus, Group, Type } from 'lucide-react';
import { Panel } from '@xyflow/react';

interface FlowControlsProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onDownload: () => void;
  onAddNode: (type: string) => void;
  onAddNote: () => void;
}

export const FlowControls = ({
  isDarkMode,
  onThemeToggle,
  onDownload,
  onAddNode,
  onAddNote,
}: FlowControlsProps) => {
  return (
    <Panel position="top-right" className="flex gap-2 bg-background/50 p-2 rounded-lg">
      <Button 
        onClick={onThemeToggle}
        variant="outline"
        size="icon"
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button 
        onClick={onDownload}
        variant="outline"
        size="icon"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button 
        onClick={() => onAddNode('Default')}
        variant="outline"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Node
      </Button>
      <Button 
        onClick={() => onAddNode('Group')}
        variant="outline"
        className="gap-2"
      >
        <Group className="h-4 w-4" />
        Add Group
      </Button>
      <Button 
        onClick={onAddNote}
        variant="outline"
        className="gap-2"
      >
        <Type className="h-4 w-4" />
        Add Note
      </Button>
    </Panel>
  );
};