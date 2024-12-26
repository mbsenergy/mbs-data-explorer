import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Play, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface SqlEditorProps {
  onExecute: (query: string) => void;
  defaultValue?: string;
}

const SqlEditor = ({ onExecute, defaultValue = "" }: SqlEditorProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [queryName, setQueryName] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleExecute = () => {
    if (query.trim()) {
      onExecute(query);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save queries",
      });
      return;
    }

    if (!queryName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a name for your query",
      });
      return;
    }

    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Query cannot be empty",
      });
      return;
    }

    try {
      const { error } = await supabase.from("saved_queries").insert({
        user_id: user.id,
        name: queryName.trim(),
        query_text: query.trim(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Query saved successfully",
      });

      setQueryName("");
    } catch (error: any) {
      console.error("Error saving query:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save query",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">SQL Query</h3>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Query name"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            className="w-[200px]"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={!query.trim() || !queryName.trim()}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            size="sm"
            onClick={handleExecute}
            disabled={!query.trim()}
          >
            <Play className="w-4 h-4 mr-2" />
            Execute
          </Button>
        </div>
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