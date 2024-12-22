import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { ConfirmDialog } from "./ConfirmDialog";
import type { TableInfo } from "./types";

interface DatasetOverviewProps {
  favorites: Set<string>;
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
}

export const DatasetOverview = ({ favorites, tables, onPreview, onDownload }: DatasetOverviewProps) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [downloadingDataset, setDownloadingDataset] = useState<string | null>(null);
  const itemsPerPage = 3;
  
  const { data: recentDownloads } = useQuery({
    queryKey: ['recentDownloads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('analytics')
        .select('dataset_name, downloaded_at')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })
        .limit(5);  // Updated to show only last 5
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const favoritesList = tables
    .filter(table => favorites.has(table.tablename));

  const totalPages = Math.ceil(favoritesList.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedFavorites = favoritesList.slice(startIndex, startIndex + itemsPerPage);

  const getFieldAndType = (tableName: string) => {
    const match = tableName.match(/^([A-Z]{2})(\d+)_(.+)/);
    return match ? { field: match[1], type: match[2] } : { field: "", type: "" };
  };

  const handleDownload = (datasetName: string) => {
    setDownloadingDataset(datasetName);
  };

  const handleConfirmDownload = () => {
    if (downloadingDataset) {
      onDownload(downloadingDataset);
      setDownloadingDataset(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Favorite Datasets</h3>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-bold">Dataset Name</TableCell>
                <TableCell className="font-bold">Field</TableCell>
                <TableCell className="font-bold">Type</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedFavorites.map((table) => {
                const { field, type } = getFieldAndType(table.tablename);
                return (
                  <TableRow key={table.tablename}>
                    <TableCell>{table.tablename}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium field-pill-${field}`}>
                        {field}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium type-pill-${type}`}>
                        {type}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
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
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Downloads</h3>
        <Carousel className="w-full">
          <CarouselContent>
            {recentDownloads?.map((download) => {
              const { field, type } = getFieldAndType(download.dataset_name);
              return (
                <CarouselItem key={download.downloaded_at}>
                  <div className="p-4 space-y-4">
                    <div className="text-left">
                      <p className="font-medium text-lg mb-2">{download.dataset_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(download.downloaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 my-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium field-pill-${field}`}>
                        {field}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium type-pill-${type}`}>
                        {type}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPreview(download.dataset_name)}
                        className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(download.dataset_name)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
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
      </Card>

      <ConfirmDialog
        isOpen={!!downloadingDataset}
        onClose={() => setDownloadingDataset(null)}
        onConfirm={handleConfirmDownload}
        title="Download Dataset"
        description="Are you sure you want to download this dataset?"
      />
    </div>
  );
};