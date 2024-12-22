import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { PreviewDialog } from "./PreviewDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DeveloperActivityProps {
  favorites: Set<string>;
  files: any[];
  onPreview: (fileName: string, section: string) => void;
  onDownload: (fileName: string, section: string) => void;
  onToggleFavorite: (fileName: string) => void;
}

export const DeveloperActivity = ({ 
  favorites, 
  files, 
  onPreview, 
  onDownload,
  onToggleFavorite 
}: DeveloperActivityProps) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const itemsPerPage = 3;

  const { data: recentDownloads } = useQuery({
    queryKey: ['developerDownloads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('developer_analytics')
        .select('file_name, file_section, downloaded_at')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const favoritesList = files.filter(file => favorites.has(file.name));
  const totalPages = Math.ceil(favoritesList.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedFavorites = favoritesList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Activity</h3>
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Favorite Resources</h4>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-bold">Name</TableCell>
                      <TableCell className="font-bold">Field</TableCell>
                      <TableCell className="font-bold">Extension</TableCell>
                      <TableCell className="font-bold">Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedFavorites.map((file) => (
                      <TableRow key={file.name}>
                        <TableCell>{file.title}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium field-pill-${file.field}`}>
                            {file.field}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-corporate-blue text-white">
                            {file.extension}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPreview(file.name, file.section)}
                            className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownload(file.name, file.section)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Sample
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Recent Downloads</h4>
              <Carousel className="w-full">
                <CarouselContent>
                  {recentDownloads?.map((download) => {
                    const file = files.find(f => f.name === download.file_name);
                    if (!file) return null;
                    
                    return (
                      <CarouselItem key={download.downloaded_at}>
                        <div className="p-4 space-y-4">
                          <div className="text-left">
                            <p className="font-medium text-lg mb-2">{file.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(download.downloaded_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 my-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium field-pill-${file.field}`}>
                              {file.field}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-corporate-blue text-white">
                              {file.extension}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPreview(download.file_name, download.file_section)}
                              className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDownload(download.file_name, download.file_section)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Sample
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleFavorite(download.file_name)}
                              className={favorites.has(download.file_name) ? "text-yellow-400" : "text-gray-400"}
                            >
                              <Star className="h-4 w-4" fill={favorites.has(download.file_name) ? "currentColor" : "none"} />
                            </Button>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};