import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const LatestDocuments = () => {
  const { data: latestDocs, isLoading: docsLoading } = useQuery({
    queryKey: ["latest-docs"],
    queryFn: async () => {
      const { data: files, error } = await supabase
        .storage
        .from('latest')
        .list('', {
          limit: 10,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }

      // Filter for PNG files (PDF previews)
      const pngFiles = files?.filter(file => file.name.toLowerCase().endsWith('.png')) || [];
      
      // For each PNG, check if there's a corresponding PDF
      const filesWithPdfs = await Promise.all(pngFiles.map(async (pngFile) => {
        const pdfName = pngFile.name.replace('.png', '.pdf');
        const { data: pdfExists } = await supabase
          .storage
          .from('latest')
          .list('', {
            search: pdfName
          });
        
        if (pdfExists?.length) {
          return {
            ...pngFile,
            pdfUrl: supabase.storage.from('latest').getPublicUrl(pdfName).data.publicUrl,
            previewUrl: supabase.storage.from('latest').getPublicUrl(pngFile.name).data.publicUrl
          };
        }
        return null;
      }));

      return filesWithPdfs.filter(Boolean);
    },
  });

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Latest Documents</h2>
      <Card className="p-6">
        {docsLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : latestDocs?.length ? (
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {latestDocs.map((file) => (
                <CarouselItem key={file.name}>
                  <div className="p-1">
                    <Card className="p-4">
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="w-full h-[400px] object-contain"
                      />
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">{file.name.replace('.png', '')}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(file.pdfUrl, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">No documents available</p>
        )}
      </Card>
    </div>
  );
};