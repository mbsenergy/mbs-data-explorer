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

interface DeveloperSectionProps {
  section: string;
  searchTerm?: string;
  selectedTag?: string;
}

export const DeveloperSection = ({ section, searchTerm = "", selectedTag = "all" }: DeveloperSectionProps) => {
  const { data: files, isLoading } = useDeveloperFiles(section);

  const filteredFiles = files?.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || file.field === selectedTag;
    return matchesSearch && matchesTag;
  });

  if (filteredFiles?.length === 0) {
    return null;
  }

  return (
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
                  <DeveloperCard {...file} section={section} />
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
  );
};