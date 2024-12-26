import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface FileUploadFormProps {
  onUploadSuccess: () => void;
}

export const FileUploadForm = ({ onUploadSuccess }: FileUploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-bucket')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('storage_files')
        .insert({
          storage_id: fileName,
          original_name: selectedFile.name,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      onUploadSuccess();
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

  return (
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
  );
};