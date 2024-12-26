import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { TagBadge } from "@/components/datasets/query-tags/TagBadge";
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
  tags?: string[];
}

interface SavedQueryCarouselProps {
  queries: SavedQuery[];
  onPreview: (query: string) => void;
}

export const SavedQueryCarousel = ({ queries, onPreview }: SavedQueryCarouselProps) => {
  return (
    <Carousel
      className="w-full mx-auto my-6 border border-white/[0.05] bg-card/50 rounded-lg p-4 relative"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {queries.slice(0, 5).map((query) => (
          <CarouselItem key={query.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
            <Card className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{query.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {query.tags?.map((tag) => (
                    <TagBadge key={tag} tag={tag} onRemove={() => {}} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Saved on {new Date(query.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(query.query_text)}
                className="w-full bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
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