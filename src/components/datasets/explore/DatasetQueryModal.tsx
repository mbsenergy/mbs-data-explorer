import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Current Query</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-1">SQL Query:</p>
            <pre className="bg-slate-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
              {query}
            </pre>
          </div>
          <div>
            <p className="font-semibold mb-1">API Call:</p>
            <pre className="bg-slate-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
              {apiCall}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};