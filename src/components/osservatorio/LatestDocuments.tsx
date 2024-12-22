import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DocumentCard } from "../dashboard/DocumentCard";
import { useOsservatorioDocuments } from "@/hooks/useOsservatorioDocuments";

export const LatestDocuments = () => {
  const { data: latestDocs, isLoading: docsLoading } = useOsservatorioDocuments();

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold">Latest Osservatorio Reports</h2>
      <div className="w-full">
        {docsLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : latestDocs?.length ? (
          <Carousel
            className="w-full mx-auto my-6 border border-card bg-card rounded-lg p-4"
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent>
              {latestDocs.map((file) => (
                <CarouselItem 
                  key={file.name} 
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <DocumentCard
                    name={file.name}
                    previewUrl={file.previewUrl}
                    pdfUrl={file.pdfUrl}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">No documents available</p>
        )}
      </div>
    </div>
  );
};