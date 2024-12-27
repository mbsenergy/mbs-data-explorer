import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SavedQueryCarousel } from "./saved-queries/SavedQueryCarousel";
import { SavedQueriesTable } from "./saved-queries/SavedQueriesTable";
import { SavedQueryPreviewModal } from "./saved-queries/SavedQueryPreviewModal";
import { CollapsibleCard } from "@/components/ui/collapsible-card";

interface SavedQueriesDisplayProps {
  onSelectQuery: (query: string) => void;
}

export const SavedQueriesDisplay = ({ onSelectQuery }: SavedQueriesDisplayProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const itemsPerPage = 7;

  const { data: savedQueries, refetch } = useQuery({
    queryKey: ['savedQueries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('saved_queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_queries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Query deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete query",
      });
    }
  };

  const handlePreview = (query: string) => {
    setSelectedQuery(query);
  };

  const totalPages = Math.ceil((savedQueries?.length || 0) / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedQueries = savedQueries?.slice(startIndex, startIndex + itemsPerPage) || [];

  if (!savedQueries?.length) {
    return null;
  }

  return (
    <CollapsibleCard
      title="Saved Queries Overview"
      icon={<Database className="h-5 w-5" />}
      defaultOpen={true}
    >
      <SavedQueryCarousel 
        queries={savedQueries} 
        onPreview={handlePreview} 
      />

      <SavedQueriesTable
        queries={displayedQueries}
        onPreview={handlePreview}
        onDelete={handleDelete}
      />

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage + 1} of {Math.max(1, totalPages)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </div>

      <SavedQueryPreviewModal
        isOpen={!!selectedQuery}
        onClose={() => setSelectedQuery(null)}
        query={selectedQuery || ""}
      />
    </CollapsibleCard>
  );
};