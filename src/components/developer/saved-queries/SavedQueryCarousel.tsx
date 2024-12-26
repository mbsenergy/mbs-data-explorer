import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SavedQuery {
  id: string;
  name: string;
  query_text: string;
  created_at: string;
}

interface SavedQueryCarouselProps {
  queries: SavedQuery[];
  onPreview: (query: string) => void;
}

export const SavedQueryCarousel = ({ queries, onPreview }: SavedQueryCarouselProps) => {
  return (
    <Carousel
      className="w-full mx-auto border border-card bg-card rounded-lg p-4"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {queries.slice(0, 5).map((query) => (
          <CarouselItem key={query.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
            <Card className="p-4 bg-card/50">
              <h3 className="font-semibold mb-2">{query.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(query.created_at).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(query.query_text)}
                  className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
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