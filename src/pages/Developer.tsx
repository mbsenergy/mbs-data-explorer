import { useState, useEffect } from "react";
import { DeveloperSection } from "@/components/developer/DeveloperSection";
import { DeveloperSearch } from "@/components/developer/DeveloperSearch";
import { DeveloperActivity } from "@/components/developer/DeveloperActivity";
import { useDeveloperFiles } from "@/hooks/useDeveloperFiles";
import { useDeveloperFavorites } from "@/hooks/useDeveloperFavorites";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PreviewDialog } from "@/components/developer/PreviewDialog";

const Developer = () => {
  const sections = ['presets', 'macros', 'developer', 'models'];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { favorites, toggleFavorite } = useDeveloperFavorites();
  const { user } = useAuth();
  const { toast } = useToast();
  const [previewData, setPreviewData] = useState<{ fileName: string; content: string; section: string } | null>(null);

  const results = sections.map(section => {
    const { data: files } = useDeveloperFiles(section);
    return (files || []).map(file => ({ ...file, section })); // Add section to each file
  }).flat();

  useEffect(() => {
    const tags = [...new Set(results.map(file => file.field))];
    setAvailableTags(tags);
  }, [results]);

  const handlePreview = async (fileName: string, section: string) => {
    try {
      if (!section) {
        throw new Error("Section is required");
      }

      const { data, error } = await supabase.storage
        .from('developer')
        .download(`${section}/${fileName}`);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to preview file.",
        });
        return;
      }

      const text = await data.text();
      setPreviewData({ fileName, content: text, section });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load preview content.",
      });
    }
  };

  const handleClosePreview = () => {
    setPreviewData(null);
  };

  const handleDownload = async (fileName: string, section: string) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to download files.",
      });
      return;
    }

    if (!section) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid file section.",
      });
      return;
    }

    try {
      // Download the file first to ensure it exists
      const { data, error: downloadError } = await supabase.storage
        .from('developer')
        .download(`${section}/${fileName}`);

      if (downloadError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to download file.",
        });
        return;
      }

      // Track the download only after successful file download
      const { error: analyticsError } = await supabase
        .from("developer_analytics")
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_section: section,
        });

      if (analyticsError) {
        console.error("Error tracking download:", analyticsError);
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process download.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1>Developer Resources</h1>
      
      <DeveloperActivity
        favorites={favorites}
        files={results}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onToggleFavorite={toggleFavorite}
      />

      <DeveloperSearch
        onSearchChange={setSearchTerm}
        onTagChange={setSelectedTag}
        onFavoriteChange={setShowFavorites}
        availableTags={availableTags}
      />

      {sections.map(section => (
        <DeveloperSection 
          key={section} 
          section={section}
          searchTerm={searchTerm}
          selectedTag={selectedTag}
          showFavorites={showFavorites}
          favorites={favorites}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onToggleFavorite={toggleFavorite}
        />
      ))}

      {previewData && (
        <PreviewDialog
          isOpen={!!previewData}
          onClose={handleClosePreview}
          filePath=""
          fileName={previewData.fileName}
          section={previewData.section}
          directData={previewData.content}
        />
      )}
    </div>
  );
};

export default Developer;