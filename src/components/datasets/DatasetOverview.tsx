import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import type { TableInfo } from "./types";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type TableNames = keyof Database['public']['Tables'];

interface DatasetOverviewProps {
  favorites: Set<string>;
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  selectedDataset?: string;
}

export const DatasetOverview = ({ 
  favorites, 
  tables, 
  onPreview, 
  onDownload,
  onSelect,
  onToggleFavorite,
  selectedDataset,
}: DatasetOverviewProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [downloadingDataset, setDownloadingDataset] = useState<string | null>(null);
  const itemsPerPage = 3;
  
  const { data: recentDownloads } = useQuery({
    queryKey: ['recentDownloads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get both analytics and exports data
      const [analyticsResponse, exportsResponse] = await Promise.all([
        supabase
          .from('analytics')
          .select('dataset_name, downloaded_at')
          .eq('user_id', user.id)
          .order('downloaded_at', { ascending: false }),
        supabase
          .from('exports')
          .select('export_name, downloaded_at')
          .eq('user_id', user.id)
          .order('downloaded_at', { ascending: false })
      ]);

      if (analyticsResponse.error) throw analyticsResponse.error;
      if (exportsResponse.error) throw exportsResponse.error;

      // Combine and format the data
      const combinedData = [
        ...analyticsResponse.data.map(item => ({
          dataset_name: item.dataset_name,
          downloaded_at: item.downloaded_at,
          type: 'sample'
        })),
        ...exportsResponse.data.map(item => ({
          dataset_name: item.export_name,
          downloaded_at: item.downloaded_at,
          type: 'export'
        }))
      ];

      // Sort by downloaded_at and take the 5 most recent
      return combinedData
        .sort((a, b) => new Date(b.downloaded_at).getTime() - new Date(a.downloaded_at).getTime())
        .slice(0, 5);
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

  const handleConfirmDownload = async () => {
    if (downloadingDataset) {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to download datasets.",
        });
        return;
      }

      try {
        // Track analytics first
        const { error: analyticsError } = await supabase
          .from("analytics")
          .insert({
            user_id: user.id,
            dataset_name: downloadingDataset,
            is_custom_query: false,
          });

        if (analyticsError) {
          console.error("Error tracking download:", analyticsError);
        }

        // Fetch first 1000 rows
        const { data, error } = await supabase
          .from(downloadingDataset as TableNames)
          .select('*')
          .limit(1000);

        if (error) throw error;

        if (!data || !data.length) {
          throw new Error("No data available for download");
        }

        // Create CSV content
        const headers = Object.keys(data[0]).filter(key => !key.startsWith('md_')).join(',');
        const rows = data.map(row => {
          return Object.entries(row)
            .filter(([key]) => !key.startsWith('md_'))
            .map(([_, value]) => {
              if (value === null) return '';
              if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
              }
              return value;
            })
            .join(',');
        });
        const csv = [headers, ...rows].join('\n');

        // Create and trigger download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${downloadingDataset}_sample.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: "Dataset sample downloaded successfully.",
        });
      } catch (error: any) {
        console.error("Error downloading dataset:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to download dataset.",
        });
      } finally {
        setDownloadingDataset(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      <Card className="p-4 col-span-9">
        <h3 className="text-lg font-semibold mb-4">Favorite Datasets</h3>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-bold">Dataset Name</TableCell>
                <TableCell className="font-bold">Field</TableCell>
                <TableCell className="font-bold">Type</TableCell>
                <TableCell className="font-bold">Actions</TableCell>
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
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onSelect(table.tablename)}
                        className={cn(
                          "bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white",
                          selectedDataset === table.tablename && "bg-[#1E293B] hover:bg-[#1E293B]/90"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPreview(table.tablename)}
                        className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(table.tablename)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
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

      <Card className="p-4 col-span-3">
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
                        size="icon"
                        onClick={() => onSelect(download.dataset_name)}
                        className={cn(
                          "bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white",
                          selectedDataset === download.dataset_name && "bg-[#1E293B] hover:bg-[#1E293B]/90"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPreview(download.dataset_name)}
                        className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(download.dataset_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleFavorite(download.dataset_name)}
                        className={favorites.has(download.dataset_name) ? "text-yellow-400" : "text-gray-400"}
                      >
                        <Star className="h-4 w-4" fill={favorites.has(download.dataset_name) ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
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