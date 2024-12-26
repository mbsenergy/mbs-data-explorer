import { DeveloperSection } from "@/components/developer/DeveloperSection";
import { DeveloperSearch } from "@/components/developer/DeveloperSearch";
import { useDeveloperFiles } from "@/hooks/useDeveloperFiles";
import { useState, useEffect } from "react";

interface SharedContentProps {
  searchTerm: string;
  selectedTag: string;
  showFavorites: boolean;
  favorites: Set<string>;
  onPreview: (fileName: string, section: string) => void;
  onDownload: (fileName: string, section: string) => void;
  onToggleFavorite: (fileName: string) => void;
}

export const SharedContent = ({
  searchTerm: externalSearchTerm,
  selectedTag: externalSelectedTag,
  showFavorites: externalShowFavorites,
  favorites,
  onPreview,
  onDownload,
  onToggleFavorite,
}: SharedContentProps) => {
  const sections = ['presets', 'macros', 'developer', 'models', 'queries'];
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);
  const [selectedTag, setSelectedTag] = useState(externalSelectedTag);
  const [showFavorites, setShowFavorites] = useState(externalShowFavorites);

  const results = sections.map(section => {
    const { data: files } = useDeveloperFiles(section);
    return (files || []).map(file => ({ ...file, section }));
  }).flat();

  useEffect(() => {
    const tags = [...new Set(results.map(file => file.field))];
    setAvailableTags(tags);
  }, [results]);

  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  useEffect(() => {
    setSelectedTag(externalSelectedTag);
  }, [externalSelectedTag]);

  useEffect(() => {
    setShowFavorites(externalShowFavorites);
  }, [externalShowFavorites]);

  return (
    <div className="space-y-6">
      <DeveloperSearch
        onSearchChange={setSearchTerm}
        onTagChange={setSelectedTag}
        onFavoriteChange={setShowFavorites}
        availableTags={availableTags}
      />

      {sections.map(section => (
        <DeveloperSection
          key={section}
          title={section.charAt(0).toUpperCase() + section.slice(1)}
          section={section}
          searchTerm={searchTerm}
          selectedTag={selectedTag}
          showFavorites={showFavorites}
          favorites={favorites}
          onPreview={onPreview}
          onDownload={onDownload}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};