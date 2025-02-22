import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Database, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { TagEditor } from "./query-tags/TagEditor";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      <Carousel
        className="w-full mx-auto my-6 border border-white/[0.05] bg-card/50 rounded-lg p-4 relative"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {queries.slice(0, 5).map((query) => (
            <CarouselItem key={query.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
              <Card className="p-4 space-y-4 metallic-card">
                <div>
                  <h3 className="font-semibold mb-2">{query.name}</h3>
                  <TagEditor
                    queryId={query.id}
                    tags={query.tags || []}
                    onUpdate={loadSavedQueries}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Saved on {new Date(query.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(query.query_text)}
                  className="w-full bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>

      <ScrollArea className="h-[300px] pr-4 mt-6">
        <div className="space-y-4">
          {queries.map((query) => (
            <Card key={query.id} className="p-4 metallic-card">
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
              <TagEditor
                queryId={query.id}
                tags={query.tags || []}
                onUpdate={loadSavedQueries}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Saved on {new Date(query.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </CollapsibleCard>
  );
};