import { Skeleton } from "@/components/ui/skeleton"; 
import { Code, Settings, Terminal, Database, FileCode, Search } from "lucide-react";
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
import React from "react";

interface DeveloperSectionProps {
  title: string;
  section: string;
  searchTerm?: string;
  selectedTag?: string;
  showFavorites?: boolean;
  favorites: Set<string>;
  onPreview: (fileName: string, section: string) => void;
  onDownload: (fileName: string, section: string) => void;
  onToggleFavorite: (fileName: string) => void;
}

const sectionIcons = {
  Presets: Settings,
  Macros: Terminal,
  Developer: Code,
  Models: Database,
  Queries: Search,
};

export const DeveloperSection = ({ 
  title,
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
  const Icon = sectionIcons[title as keyof typeof sectionIcons];

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
    <Card className="p-6 space-y-2 metallic-card relative overflow-hidden">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="h-6 w-6" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="w-full">
          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : filteredFiles?.length ? (
            <Carousel
              className="w-full mx-auto my-6 border border-white/[0.05] bg-card/50 rounded-lg p-4 relative"
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
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
            </Carousel>
          ) : (
            <p className="text-center text-muted-foreground">No files available</p>
          )}
        </div>
      </div>
    </Card>
  );
};