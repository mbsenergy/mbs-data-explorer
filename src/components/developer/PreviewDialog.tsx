import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFileContent } from "@/hooks/useFileContent";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "The file content has been copied to your clipboard.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{fileName}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="ml-auto bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30 text-white"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
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