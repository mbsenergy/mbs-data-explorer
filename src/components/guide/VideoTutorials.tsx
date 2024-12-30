import React from "react";
import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";

interface VideoTutorialProps {
  videos: string[];
}

export const VideoTutorials = ({ videos }: VideoTutorialProps) => {
  return (
    <Card className="p-4 metallic-card">
      <div className="flex items-center gap-2 mb-4">
        <Video className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">Video Tutorials</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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