import { useState } from "react";
import { PreviewDialog } from "@/components/developer/PreviewDialog";
import { useDeveloperFavorites } from "@/hooks/useDeveloperFavorites";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SharedContent } from "@/components/developer/tabs/SharedContent";
import { PersonalContent } from "@/components/developer/tabs/PersonalContent";
import { FileText, Grid } from "lucide-react";
import { DeveloperActivity } from "@/components/developer/DeveloperActivity";
import { useDeveloperFiles } from "@/hooks/useDeveloperFiles";

const Developer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, toggleFavorite } = useDeveloperFavorites();
  const { user } = useAuth();
  const { toast } = useToast();
  const [previewData, setPreviewData] = useState<{ fileName: string; content: string; section: string } | null>(null);

  // Fetch all files to pass to DeveloperActivity
  const sections = ['presets', 'macros', 'developer', 'models', 'queries'];
  const results = sections.map(section => {
    const { data: files } = useDeveloperFiles(section);
    return (files || []).map(file => ({ ...file, section }));
  }).flat();

  const handlePreview = async (fileName: string, section: string) => {
    try {
      if (!section) {
        throw new Error('Section is required for preview');
      }

      const { data, error } = await supabase.storage
        .from('developer')
        .download(`${section}/${fileName}`);

      if (error) {
        console.error('Preview error:', error);
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
      console.error('Preview error:', error);
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

    try {
      const { data, error: downloadError } = await supabase.storage
        .from('developer')
        .download(`${section}/${fileName}`);

      if (downloadError) throw downloadError;

      const { error: analyticsError } = await supabase
        .from("developer_analytics")
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_section: section,
        });

      if (analyticsError) {
        console.error("Analytics tracking error:", analyticsError);
      }

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
      console.error('Download process error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process download.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-green-500">
        Developer Resources
      </h1>

      <DeveloperActivity
        favorites={favorites}
        files={results}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onToggleFavorite={toggleFavorite}
      />

      <Tabs defaultValue="shared" className="space-y-6">
        <TabsList>
          <TabsTrigger value="shared" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Shared Resources
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Personal Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shared" className="space-y-6">
          <SharedContent
            searchTerm={searchTerm}
            selectedTag={selectedTag}
            showFavorites={showFavorites}
            favorites={favorites}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <PersonalContent />
        </TabsContent>
      </Tabs>

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