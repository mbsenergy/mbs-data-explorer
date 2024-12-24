import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DeveloperCard } from "./DeveloperCard";
import { useDeveloperFiles } from "@/hooks/useDeveloperFiles";
import { Card } from "../ui/card";

interface DeveloperSectionProps {
  section: string;
  searchTerm?: string;
  selectedTag?: string;
  showFavorites?: boolean;
  favorites: Set<string>;
  onPreview: (fileName: string, section: string) => void;
  onDownload: (fileName: string, section: string) => void;
  onToggleFavorite: (fileName: string) => void;
}

export const DeveloperSection = ({ 
  section, 
  searchTerm = "", 
  selectedTag = "all",
  showFavorites = false,
  favorites,
  onPreview,
  onDownload,
  onToggleFavorite
}: DeveloperSectionProps) => {
  const { data: files, isLoading } = useDeveloperFiles(section);

  const filteredFiles = files?.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || file.field === selectedTag;
    const matchesFavorites = !showFavorites || favorites.has(file.name);
    return matchesSearch && matchesTag && matchesFavorites;
  });

  if (filteredFiles?.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 space-y-2 metallic-card">
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold capitalize">{section}</h2>
      <div className="w-full">
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : filteredFiles?.length ? (
          <Carousel
            className="w-full mx-auto my-6 border border-card bg-card rounded-lg p-4"
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent>
              {filteredFiles.map((file) => (
                <CarouselItem 
                  key={file.name} 
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <DeveloperCard 
                    {...file} 
                    section={section}
                    isFavorite={favorites.has(file.name)}
                    onToggleFavorite={onToggleFavorite}
                    onPreview={onPreview}
                    onDownload={onDownload}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">No files available</p>
        )}
      </div>
    </div>
    </Card>
  );
};