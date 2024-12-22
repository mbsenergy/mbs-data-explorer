import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DocumentCard } from "./DocumentCard";
import { useLatestDocuments } from "@/hooks/useLatestDocuments";

export const LatestDocuments = () => {
  const { data: latestDocs, isLoading: docsLoading } = useLatestDocuments();

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold mb-1">Latest Documents</h2>
      <div className="w-full">
        {docsLoading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : latestDocs?.length ? (
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {latestDocs.map((file) => (
                <CarouselItem key={file.name}>
                  <DocumentCard
                    name={file.name}
                    previewUrl={file.previewUrl}
                    pdfUrl={file.pdfUrl}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">No documents available</p>
        )}
      </div>
    </div>
  );
};