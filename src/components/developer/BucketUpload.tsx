import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { FileUploadForm } from "./bucket/FileUploadForm";
import { FilePreviewDialog } from "./bucket/FilePreviewDialog";
import { FileTable } from "./bucket/FileTable";

interface StorageFile {
  id: string;
  storage_id: string;
  original_name: string;
  created_at: string;
  tags: string[];
}

export const BucketUpload = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<{ path: string; name: string } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadFiles = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('storage_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load files",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [user]);

  const handlePreview = (storageId: string, fileName: string) => {
    setPreviewFile({
      path: `${user?.id}/${storageId}`,
      name: fileName
    });
  };

  const handleDownload = async (storageId: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-bucket')
        .download(`${user?.id}/${storageId}`);

      if (error) throw error;

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
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file",
      });
    }
  };

  const handleDelete = async (fileId: string, storageId: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('user-bucket')
        .remove([`${user?.id}/${storageId}`]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('storage_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      setFiles(files.filter(f => f.id !== fileId));
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file",
      });
    }
  };

  const handleTagsUpdate = (fileId: string, newTags: string[]) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, tags: newTags } : file
    ));
  };

  return (
    <CollapsibleCard
      title="Personal Bucket"
      icon={<Database className="h-5 w-5" />}
      defaultOpen={true}
    >
      <Card className="p-4 space-y-4 metallic-card">
        <FileUploadForm onUploadSuccess={loadFiles} />
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <p>Loading files...</p>
        </div>
      ) : files.length > 0 ? (
        <Card className="p-4 metallic-card">
          <FileTable
            files={files}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onTagsUpdate={handleTagsUpdate}
          />
        </Card>
      ) : (
        <div className="flex justify-center p-4">
          <p className="text-muted-foreground">No files uploaded yet</p>
        </div>
      )}

      {previewFile && (
        <FilePreviewDialog
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          filePath={previewFile.path}
          fileName={previewFile.name}
        />
      )}
    </CollapsibleCard>
  );
};