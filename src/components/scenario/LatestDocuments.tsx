import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DocumentCard } from "../dashboard/DocumentCard";
import { Card } from "@/components/ui/card";
import { useScenarioDocuments } from "@/hooks/useScenarioDocuments";

export const LatestDocuments = () => {
  const { data: latestDocs, isLoading: docsLoading } = useScenarioDocuments();

  return (
    <Card className="p-4 metallic-card">
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold">Latest Scenario Reports</h2>
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
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">No documents available</p>
        )}
      </div>
    </div>
    </Card>
  );
};