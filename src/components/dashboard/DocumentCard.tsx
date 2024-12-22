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
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="aspect-[4/3] relative">
        <img
          src={previewUrl}
          alt={name}
          className="w-full h-full object-contain bg-black/5"
        />
      </div>
      <div className="p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground font-medium truncate mr-4">
            {name.replace('.png', '')}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(pdfUrl, '_blank')}
            className="shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </Card>
  );
};