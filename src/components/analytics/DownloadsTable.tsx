import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DownloadsTableProps {
  data: any[];
  isLoading: boolean;
  title: string;
  getDatasetInfo?: (datasetName: string) => { type: string; tags: string[] };
}

export const DownloadsTable = ({ data, isLoading, title, getDatasetInfo }: DownloadsTableProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data?.slice(startIndex, endIndex) || [];

  const getFileInfo = (item: any) => {
    if (getDatasetInfo && item.dataset_name) {
      return getDatasetInfo(item.dataset_name);
    }
    
    // Handle case where file_name might be undefined
    const fileName = item.file_name || '';
    const fileExtension = fileName.includes('.') ? fileName.split('.').pop() : '';
    
    return { 
      type: item.file_section || 'Unknown', 
      tags: fileExtension ? [fileExtension] : [] 
    };
  };

  return (
    <Card className="p-6 bg-card metallic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{getDatasetInfo ? "Dataset" : "File"}</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ) : currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No downloads yet
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((item) => {
                    const info = getFileInfo(item);
                    const displayName = getDatasetInfo ? item.dataset_name : item.file_name;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{displayName || 'Unnamed'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{info.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            {info.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.downloaded_at || item.created_at), 'dd MMM yyyy HH:mm')}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <PaginationPrevious className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <Button
                        variant={currentPage === page ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <PaginationNext className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};