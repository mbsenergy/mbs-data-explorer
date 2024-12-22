import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFileContent } from "@/hooks/useFileContent";
import { Loader2 } from "lucide-react";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
  section: string;
}

export const PreviewDialog = ({ isOpen, onClose, filePath, fileName, section }: PreviewDialogProps) => {
  const fullPath = `${section}/${filePath}`;
  const { data: content, isLoading } = useFileContent(fullPath);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <pre className="p-4 text-sm bg-muted rounded-md overflow-x-auto">
              <code>{content}</code>
            </pre>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};