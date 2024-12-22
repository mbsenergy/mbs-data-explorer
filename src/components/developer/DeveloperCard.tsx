import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Star } from "lucide-react";
import { PreviewDialog } from "./PreviewDialog";
import { useDeveloperFavorites } from "@/hooks/useDeveloperFavorites";

interface DeveloperCardProps {
  name: string;
  url: string;
  field: string;
  extension: string;
  title: string;
  section: string;
}

export const DeveloperCard = ({ name, url, field, extension, title, section }: DeveloperCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { favorites, toggleFavorite } = useDeveloperFavorites();

  return (
    <>
      <Card className="overflow-hidden border shadow-lg h-[200px] flex flex-col">
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex gap-2 mb-2">
            <Badge variant="secondary">{field}</Badge>
            <Badge variant="outline" className="bg-corporate-blue text-white border-corporate-blue">{extension}</Badge>
          </div>
          <h3 className="text-lg font-medium mb-2 line-clamp-2">{title}</h3>
          <div className="mt-auto flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="shrink-0 bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(url, '_blank')}
                className="shrink-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(name)}
                className={favorites.has(name) ? "text-yellow-400" : "text-gray-400"}
              >
                <Star className="h-4 w-4" fill={favorites.has(name) ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        filePath={name}
        fileName={name}
        section={section}
      />
    </>
  );
};