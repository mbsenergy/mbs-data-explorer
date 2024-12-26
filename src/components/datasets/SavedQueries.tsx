import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedQuery {
  id: string;
  name: string;
  query_text: string;
  created_at: string;
}

interface SavedQueriesProps {
  onSelectQuery: (query: string) => void;
}

export const SavedQueries = ({ onSelectQuery }: SavedQueriesProps) => {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSavedQueries();
    }
  }, [user]);

  const loadSavedQueries = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_queries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setQueries(data || []);
    } catch (error: any) {
      console.error("Error loading saved queries:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved queries",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_queries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Query deleted successfully",
      });

      await loadSavedQueries();
    } catch (error: any) {
      console.error("Error deleting query:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete query",
      });
    }
  };

  if (!queries.length) {
    return null;
  }

  return (
    <Card className="p-6 metallic-card">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Saved Queries</h2>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {queries.map((query) => (
            <Card key={query.id} className="p-4 bg-card/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{query.name}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectQuery(query.query_text)}
                    className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                  >
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(query.id)}
                    className="bg-red-500/20 hover:bg-red-500/30"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <pre className="text-sm bg-gray-900 p-2 rounded-md overflow-x-auto">
                {query.query_text}
              </pre>
              <p className="text-sm text-muted-foreground mt-2">
                Saved on {new Date(query.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};