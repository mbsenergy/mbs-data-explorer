import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface DeveloperCardProps {
  name: string;
  url: string;
  field: string;
  extension: string;
  title: string;
}

export const DeveloperCard = ({ name, url, field, extension, title }: DeveloperCardProps) => {
  return (
    <Card className="overflow-hidden border shadow-lg h-[200px] flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex gap-2 mb-2">
          <Badge variant="secondary">{field}</Badge>
          <Badge variant="outline" className="bg-corporate-blue text-white border-corporate-blue">{extension}</Badge>
        </div>
        <h3 className="text-lg font-medium mb-2 line-clamp-2">{title}</h3>
        <div className="mt-auto flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
};