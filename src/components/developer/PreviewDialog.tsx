import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
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
  let parsedData: any[] = [];
  
  try {
    if (displayContent) {
      parsedData = JSON.parse(displayContent);
    }
  } catch (e) {
    console.error('Failed to parse JSON data');
  }

  const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};