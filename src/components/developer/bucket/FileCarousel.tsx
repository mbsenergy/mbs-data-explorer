import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2 } from "lucide-react";
import { FileTagEditor } from "./FileTagEditor";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FileCarouselProps {
  files: Array<{
    id: string;
    original_name: string;
    storage_id: string;
    created_at: string;
    tags: string[];
  }>;
  onPreview: (filePath: string, fileName: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onDelete: (fileId: string, storageId: string) => void;
  onTagsUpdate: (fileId: string, newTags: string[]) => void;
}

export const FileCarousel = ({ 
  files, 
  onPreview, 
  onDownload, 
  onDelete,
  onTagsUpdate 
}: FileCarouselProps) => {
  return (
    <Carousel
      className="w-full mx-auto my-6 border border-white/[0.05] bg-card/50 rounded-lg p-4 relative"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {files.slice(0, 5).map((file) => (
          <CarouselItem key={file.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
            <Card className="p-4 space-y-4 metallic-card">
              <div>
                <h3 className="font-semibold mb-2">{file.original_name}</h3>
                <FileTagEditor
                  fileId={file.id}
                  initialTags={file.tags}
                  onTagsUpdate={(newTags) => onTagsUpdate(file.id, newTags)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Uploaded on {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(file.storage_id, file.original_name)}
                  className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(file.storage_id, file.original_name)}
                  className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(file.id, file.storage_id)}
                  className="bg-red-500/20 hover:bg-red-500/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
  );
};