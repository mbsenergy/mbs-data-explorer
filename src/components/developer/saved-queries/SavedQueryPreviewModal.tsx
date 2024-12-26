import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedQueryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

export const SavedQueryPreviewModal = ({
  isOpen,
  onClose,
  query,
}: SavedQueryPreviewModalProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      toast({
        title: "Success",
        description: "Query copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy query",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] text-2xl font-bold">
            Saved Query
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] font-semibold">
                SQL Query:
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Query
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
              {query}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};