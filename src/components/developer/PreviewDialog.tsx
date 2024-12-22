import React from 'react';
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  const fullPath = section ? `${section}/${filePath}` : filePath;
  const { data: fileContent, isLoading, error } = useFileContent(directData ? '' : fullPath);
  
  const displayContent = directData || fileContent;
  let parsedData: any[] = [];
  
  try {
    if (displayContent) {
      parsedData = JSON.parse(displayContent);
    }
  } catch (e) {
    // Not JSON data, which is fine
  }

  const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayContent || '');
      toast({
        description: "Content copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy content",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{fileName}</DialogTitle>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 bg-muted hover:bg-muted/80"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <ScrollArea className="flex-1 h-[60vh] w-full scrollbar-custom">
          <div className="p-4">
            {isLoading && !directData && (
              <div className="text-center">Loading...</div>
            )}
            {error && !directData && (
              <div className="text-red-500">Error loading file content</div>
            )}
            {parsedData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column} className="font-bold">
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column}>
                          {String(row[column])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {displayContent}
              </pre>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};