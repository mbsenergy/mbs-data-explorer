import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface DatasetQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

export const DatasetQueryModal = ({ isOpen, onClose, query }: DatasetQueryModalProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    toast.success("Query copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>SQL Query</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="absolute right-2 top-2"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto">
            <code>{query}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};