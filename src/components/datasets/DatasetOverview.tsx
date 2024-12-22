import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { TableInfo } from "./types";

interface DatasetOverviewProps {
  favorites: Set<string>;
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
}

export const DatasetOverview = ({ favorites, tables, onPreview, onDownload }: DatasetOverviewProps) => {
  const { user } = useAuth();
  
  const { data: recentDownloads } = useQuery({
    queryKey: ['recentDownloads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('analytics')
        .select('dataset_name, downloaded_at')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const favoritesList = tables
    .filter(table => favorites.has(table.tablename))
    .slice(0, 3);

  const getFieldAndType = (tableName: string) => {
    const match = tableName.match(/^([A-Z]{2})(\d+)_(.+)/);
    return match ? { field: match[1], type: match[2] } : { field: "", type: "" };
  };

  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Favorite Datasets</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Dataset Name</TableCell>
              <TableCell className="font-bold">Field</TableCell>
              <TableCell className="font-bold">Type</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {favoritesList.map((table) => {
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
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Downloads</h3>
        <Carousel className="w-full">
          <CarouselContent>
            {recentDownloads?.map((download) => {
              const { field, type } = getFieldAndType(download.dataset_name);
              return (
                <CarouselItem key={download.downloaded_at}>
                  <div className="p-4">
                    <p className="font-medium">{download.dataset_name}</p>
                    <div className="flex gap-2 my-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium field-pill-${field}`}>
                        {field}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium type-pill-${type}`}>
                        {type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {new Date(download.downloaded_at).toLocaleDateString()}
                    </p>
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
                        onClick={() => onDownload(download.dataset_name)}
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
    </div>
  );
};