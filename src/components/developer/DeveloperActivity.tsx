import React, { useState } from 'react';
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FavoriteResources } from "./FavoriteResources";
import { RecentDownloads } from "./RecentDownloads";

interface DeveloperActivityProps {
  favorites: Set<string>;
  files: any[];
  onPreview: (fileName: string, section: string) => void;
  onDownload: (fileName: string, section: string) => void;
  onToggleFavorite: (fileName: string) => void;
}

export const DeveloperActivity = ({ 
  favorites, 
  files, 
  onPreview, 
  onDownload,
  onToggleFavorite 
}: DeveloperActivityProps) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const itemsPerPage = 3;

  const { data: recentDownloads } = useQuery({
    queryKey: ['developerDownloads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('developer_analytics')
        .select('file_name, file_section, downloaded_at')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const favoritesList = files.filter(file => favorites.has(file.name));
  const totalPages = Math.ceil(favoritesList.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedFavorites = favoritesList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="p-6 mb-6 metallic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Activity</h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="grid grid-cols-12 gap-6 mb-8">
            <FavoriteResources
              displayedFavorites={displayedFavorites}
              currentPage={currentPage}
              totalPages={totalPages}
              onPreview={onPreview}
              onDownload={onDownload}
              onPageChange={setCurrentPage}
            />
            <RecentDownloads
              recentDownloads={recentDownloads}
              files={files}
              favorites={favorites}
              onPreview={onPreview}
              onDownload={onDownload}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};