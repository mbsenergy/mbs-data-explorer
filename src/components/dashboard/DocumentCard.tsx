import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";

interface DocumentCardProps {
  name: string;
  previewUrl: string;
  pdfUrl: string;
}

export const DocumentCard = ({ name, previewUrl, pdfUrl }: DocumentCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg h-[300px] flex flex-col">
      <div className="flex-1 relative">
        <img
          src={previewUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 bg-card/50 backdrop-blur-sm">
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground font-medium truncate">
            {name.replace('.png', '')}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(pdfUrl, '_blank')}
            className="shrink-0 hover:bg-[#4fd9e8]"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};