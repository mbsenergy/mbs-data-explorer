import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Database, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { TagBadge } from "./query-tags/TagBadge";
import { TagInput } from "./query-tags/TagInput";

interface SavedQuery {
  id: string;
  name: string;
  query_text: string;
  created_at: string;
  tags: string[];
}

export interface SavedQueriesProps {
  onSelectQuery: (query: string) => void;
  onSelect?: (query: string) => void; // Added for backward compatibility
}

export const SavedQueries = ({ onSelectQuery, onSelect }: SavedQueriesProps) => {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null);
  const [newTag, setNewTag] = useState("");
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

  const handleAddTag = async (queryId: string) => {
    if (!newTag.trim()) return;

    try {
      const query = queries.find(q => q.id === queryId);
      if (!query) return;

      const updatedTags = [...(query.tags || []), newTag.trim()];
      
      const { error } = await supabase
        .from("saved_queries")
        .update({ tags: updatedTags })
        .eq("id", queryId);

      if (error) throw error;

      setNewTag("");
      await loadSavedQueries();
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add tag",
      });
    }
  };

  const handleRemoveTag = async (queryId: string, tagToRemove: string) => {
    try {
      const query = queries.find(q => q.id === queryId);
      if (!query) return;

      const updatedTags = query.tags.filter(tag => tag !== tagToRemove);
      
      const { error } = await supabase
        .from("saved_queries")
        .update({ tags: updatedTags })
        .eq("id", queryId);

      if (error) throw error;

      await loadSavedQueries();
      
      toast({
        title: "Success",
        description: "Tag removed successfully",
      });
    } catch (error: any) {
      console.error("Error removing tag:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove tag",
      });
    }
  };

  const handleCopyQuery = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query);
      toast({
        title: "Success",
        description: "Query copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy query",
      });
    }
  };

  const handleSelect = (query: string) => {
    if (onSelect) onSelect(query);
    if (onSelectQuery) onSelectQuery(query);
  };

  if (!queries.length) {
    return null;
  }

  return (
    <CollapsibleCard
      title="Saved Queries"
      icon={<Database className="h-5 w-5" />}
      defaultOpen={false}
    >
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
                    onClick={() => handleSelect(query.query_text)}
                    className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
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
              <div className="flex flex-wrap gap-2 mt-2">
                {query.tags?.map((tag) => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    onRemove={(tag) => handleRemoveTag(query.id, tag)}
                  />
                ))}
                <TagInput
                  value={newTag}
                  onChange={setNewTag}
                  onAdd={() => handleAddTag(query.id)}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Saved on {new Date(query.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedQuery} onOpenChange={() => setSelectedQuery(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedQuery?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">SQL Query:</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedQuery && handleCopyQuery(selectedQuery.query_text)}
                  className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                >
                  Copy Query
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                {selectedQuery?.query_text}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CollapsibleCard>
  );
};
