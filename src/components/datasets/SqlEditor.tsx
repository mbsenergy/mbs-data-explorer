import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play } from "lucide-react";

interface SqlEditorProps {
  onExecute: (query: string) => void;
  defaultValue?: string;
}

const SqlEditor = ({ onExecute, defaultValue = "" }: SqlEditorProps) => {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">SQL Query</h3>
        <Button
          size="sm"
          onClick={() => onExecute(query)}
          disabled={!query.trim()}
        >
          <Play className="w-4 h-4 mr-2" />
          Execute
        </Button>
      </div>
      <Textarea
        placeholder="SELECT * FROM your_table WHERE..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="font-mono min-h-[200px]"
      />
    </div>
  );
};

export default SqlEditor;