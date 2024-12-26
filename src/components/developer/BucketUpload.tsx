import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Upload, FileType, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export const BucketUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size must be less than 1MB",
      });
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file first",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-bucket')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('user-bucket')
        .getPublicUrl(filePath);

      const newFile = {
        id: fileName,
        name: selectedFile.name,
        url: publicUrl,
        created_at: new Date().toISOString(),
      };

      setFiles(prev => [newFile, ...prev]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const filePath = `${user?.id}/${fileId}`;
      const { error } = await supabase.storage
        .from('user-bucket')
        .remove([filePath]);

      if (error) throw error;

      setFiles(prev => prev.filter(f => f.id !== fileId));
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

  const handleDownload = async (file: UploadedFile) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name; // Use original file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file",
      });
    }
  };

  return (
    <CollapsibleCard
      title="Personal Bucket"
      icon={<Database className="h-5 w-5" />}
      defaultOpen={true}
    >
      <Card className="p-4 space-y-4 metallic-card">
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="flex-1"
          />
          <Button 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile} 
            className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </Card>

      <Carousel
        className="w-full mx-auto my-6 border border-white/[0.05] bg-card/50 rounded-lg p-4 relative"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {files.slice(0, 5).map((file) => (
            <CarouselItem key={file.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
              <Card className="p-4 space-y-4 metallic-card">
                <div className="flex items-center gap-2">
                  <FileType className="h-5 w-5" />
                  <p className="font-semibold truncate flex-1">{file.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uploaded on {new Date(file.created_at).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="bg-red-500/20 hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </CollapsibleCard>
  );
};