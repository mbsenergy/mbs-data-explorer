import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Play, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SqlEditorProps {
  onExecute: (query: string, useBatchProcessing: boolean) => void;
  defaultValue?: string;
  isLoading?: boolean;
}

export const SqlQueryBox = ({ onExecute, defaultValue = "", isLoading = false }: SqlEditorProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [queryName, setQueryName] = useState("");
  const [useBatchProcessing, setUseBatchProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleExecute = () => {
    if (query.trim()) {
      onExecute(query, useBatchProcessing);
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
    <Card className="p-6 space-y-4 metallic-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">SQL Query</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="batch-processing"
              checked={useBatchProcessing}
              onCheckedChange={setUseBatchProcessing}
            />
            <Label htmlFor="batch-processing">Batch Processing</Label>
          </div>
          <Input
            placeholder="Query name"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            className="w-[200px]"
            disabled={isLoading}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={isLoading || !query.trim() || !queryName.trim()}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            size="sm"
            onClick={handleExecute}
            disabled={isLoading || !query.trim()}
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
        disabled={isLoading}
      />
    </Card>
  );
};