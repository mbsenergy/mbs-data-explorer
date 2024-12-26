import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SavedQuery {
  id: string;
  name: string;
  query_text: string;
  created_at: string;
}

export const SavedQueriesDisplay = ({
  onSelectQuery
}: {
  onSelectQuery: (query: string) => void;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const { data: savedQueries, refetch } = useQuery({
    queryKey: ['savedQueries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('saved_queries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SavedQuery[];
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

  const totalPages = Math.ceil((savedQueries?.length || 0) / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedQueries = savedQueries?.slice(startIndex, startIndex + itemsPerPage) || [];

  if (!savedQueries?.length) {
    return null;
  }

  return (
    <Card className="p-6 space-y-6 metallic-card">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Saved Queries Overview</h2>
      </div>

      {/* Carousel Section */}
      <Carousel
        className="w-full mx-auto border border-card bg-card rounded-lg p-4"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {savedQueries.slice(0, 5).map((query) => (
            <CarouselItem key={query.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <Card className="p-4 bg-card/50">
                <h3 className="font-semibold mb-2">{query.name}</h3>
                <pre className="text-sm bg-gray-900 p-2 rounded-md overflow-x-auto max-h-[100px]">
                  {query.query_text}
                </pre>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(query.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectQuery(query.query_text)}
                      className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                    >
                      Load
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>

      {/* Table Section */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Query</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedQueries.map((query) => (
              <TableRow key={query.id}>
                <TableCell className="font-medium">{query.name}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {query.query_text}
                </TableCell>
                <TableCell>
                  {new Date(query.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
    </Card>
  );
};