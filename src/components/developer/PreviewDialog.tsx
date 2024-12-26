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
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useToast } from "@/components/ui/use-toast";
import { useFileContent } from "@/hooks/useFileContent";
import { Highlight, themes } from "prism-react-renderer";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
  section: string;
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
  const fullPath = section ? `${section}/${fileName}` : fileName;
  const { data: fileContent, isLoading, error } = useFileContent(directData ? '' : fullPath);
  
  const displayContent = directData || fileContent;
  let parsedData: any[] = [];
  let isJson = false;
  
  try {
    if (displayContent) {
      const parsed = JSON.parse(displayContent);
      parsedData = Array.isArray(parsed) ? parsed : [parsed];
      isJson = parsedData.length > 0;
    }
  } catch (e) {
    isJson = false;
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

  const getLanguage = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'jsx';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'tsx';
      case 'py':
        return 'python';
      case 'json':
        return 'json';
      case 'sql':
        return 'sql';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      default:
        return 'typescript';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <VisuallyHidden>Preview {fileName}</VisuallyHidden>
          </DialogTitle>
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30 text-white"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 h-[60vh] w-full overflow-y-auto scrollbar-custom">
          <div className="p-4">
            {isLoading && !directData && (
              <div className="text-center">Loading...</div>
            )}
            {error && !directData && (
              <div className="text-red-500">Error loading file content</div>
            )}
            {isJson && parsedData.length > 0 ? (
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
              <div className="rounded-md bg-gray-900 p-4">
                <Highlight
                  theme={themes.nightOwl}
                  code={displayContent || ''}
                  language={getLanguage(fileName)}
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre 
                      className={`${className} font-mono`}
                      style={{ 
                        ...style, 
                        margin: 0,
                        fontFamily: "'JetBrains Mono', monospace !important",
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          <span className="text-gray-500 mr-4 select-none">
                            {(i + 1).toString().padStart(3, ' ')}
                          </span>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};