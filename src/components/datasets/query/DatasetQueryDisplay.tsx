import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatasetQueryDisplayProps {
  query: string;
  apiCall: string;
}

export const DatasetQueryDisplay = ({ query, apiCall }: DatasetQueryDisplayProps) => {
  const { toast } = useToast();

  const handleCopy = async (text: string, type: 'query' | 'python') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type === 'query' ? 'SQL query' : 'Python code'} copied to clipboard`,
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
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] font-semibold">
            SQL Query:
          </p>
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
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] font-semibold">
            Python API Call:
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(apiCall, 'python')}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Python Code
          </Button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
          {apiCall}
        </pre>
      </div>
    </div>
  );
};