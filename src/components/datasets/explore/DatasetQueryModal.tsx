import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatasetQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  apiCall: string;
}

export const DatasetQueryModal = ({
  isOpen,
  onClose,
  query,
  apiCall,
}: DatasetQueryModalProps) => {
  const { toast } = useToast();

  const handleCopy = async (text: string, type: 'query' | 'api') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type === 'query' ? 'SQL query' : 'API call'} copied to clipboard`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Current Query</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold">SQL Query:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(query, 'query')}
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
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold">API Call:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(apiCall, 'api')}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy API Call
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
              {apiCall}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};