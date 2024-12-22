import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFileContent } from "@/hooks/useFileContent";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
  section?: string;
  directData?: string;
}

export const PreviewDialog = ({ 
  isOpen, 
  onClose, 
  filePath, 
  fileName,
  section,
  directData 
}: PreviewDialogProps) => {
  const { data: fileContent, isLoading, error } = useFileContent(directData ? '' : filePath);
  
  const displayContent = directData || fileContent;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4">
          {isLoading && !directData && (
            <div className="text-center">Loading...</div>
          )}
          {error && !directData && (
            <div className="text-red-500">Error loading file content</div>
          )}
          {displayContent && (
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {displayContent}
            </pre>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};