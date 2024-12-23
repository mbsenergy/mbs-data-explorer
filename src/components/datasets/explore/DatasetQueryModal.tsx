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

  const pythonApiCall = `import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

${apiCall.replace('await supabase', 'response = supabase').replace(/\n\s+/g, '\n')}
data = response.execute()`

  const handleCopy = async (text: string, type: 'query' | 'api' | 'python') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type === 'query' ? 'SQL query' : type === 'api' ? 'API call' : 'Python code'} copied to clipboard`,
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
              <p className="font-semibold">JavaScript API Call:</p>
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
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold">Python API Call:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(pythonApiCall, 'python')}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Python Code
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
              {pythonApiCall}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};