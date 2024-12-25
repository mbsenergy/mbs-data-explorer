import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Download, Eye, Star } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";

interface RecentDownloadsProps {
  recentDownloads: any[];
  files: any[];
  favorites: Set<string>;
  onPreview: (fileName: string, section: string) => void;
  onDownload: (fileName: string, section: string) => void;
  onToggleFavorite: (fileName: string) => void;
}

export const RecentDownloads = ({
  recentDownloads,
  files,
  favorites,
  onPreview,
  onDownload,
  onToggleFavorite,
}: RecentDownloadsProps) => {
  return (
    <Card className="p-4 col-span-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-6 w-6" />
        <h3 className="text-xl font-semibold text-white">Recent Downloads</h3>
      </div>
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
                      className="hover:bg-[#4fd9e8]"
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
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
      </Carousel>
    </Card>
  );
};