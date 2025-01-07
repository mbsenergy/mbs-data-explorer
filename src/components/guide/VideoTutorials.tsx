import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Video, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoTutorialProps {
  videos: string[];
}

export const VideoTutorials = ({ videos }: VideoTutorialProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="p-6 metallic-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Video Tutorials</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 transition-all",
        !isOpen && "hidden"
      )}>
        {videos.map((src, index) => (
          <div key={index} className="aspect-video w-full rounded-lg overflow-hidden border border-card bg-card/50">
            <iframe
              className="w-full h-full"
              src={src}
              title={`Video Tutorial ${index + 1}`}
              frameBorder="0"
              referrerPolicy="unsafe-url"
              allowFullScreen
              allow="clipboard-write"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};