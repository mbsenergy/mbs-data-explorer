import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
}

export const FilePreviewDialog = ({ isOpen, onClose, filePath, fileName }: FilePreviewDialogProps) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadFileContent = async () => {
      if (!isOpen || !filePath) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase.storage
          .from('user-bucket')
          .download(filePath);

        if (error) throw error;

        const text = await data.text();
        setContent(text);
      } catch (error) {
        console.error('Preview error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load file preview",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFileContent();
  }, [filePath, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 h-[60vh] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              Loading preview...
            </div>
          ) : (
            <pre className="p-4 text-sm whitespace-pre-wrap">{content}</pre>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};