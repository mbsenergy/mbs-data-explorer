import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
data = response.execute()`;

  const rApiCall = `library(DBI)
library(RPostgres)

# Connect to the database
con <- dbConnect(
  Postgres(),
  dbname = "your_database",
  host = Sys.getenv("SUPABASE_HOST"),
  port = 5432,
  user = "postgres",
  password = Sys.getenv("SUPABASE_DB_PASSWORD")
)

# Execute the query
query <- "${query}"
result <- dbGetQuery(con, query)

# Don't forget to close the connection
dbDisconnect(con)`;

  const handleCopy = async (text: string, type: 'query' | 'python' | 'r') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type === 'query' ? 'SQL query' : type === 'python' ? 'Python code' : 'R code'} copied to clipboard`,
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
          <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] text-2xl font-bold">
            Current Query
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="sql" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sql">SQL</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="r">R</TabsTrigger>
          </TabsList>

          <TabsContent value="sql">
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
          </TabsContent>

          <TabsContent value="python">
            <div className="flex justify-between items-center mb-1">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] font-semibold">
                Python Code:
              </p>
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
          </TabsContent>

          <TabsContent value="r">
            <div className="flex justify-between items-center mb-1">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] font-semibold">
                R Code:
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(rApiCall, 'r')}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy R Code
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
              {rApiCall}
            </pre>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};