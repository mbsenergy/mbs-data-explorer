import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Loader2 } from "lucide-react";

interface FileUploadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label: string;
}

export const FileUploadButton = ({ onClick, isLoading, label }: FileUploadButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-primary/20 hover:bg-primary/30 text-xs"
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
      ) : (
        <Upload className="h-3 w-3 mr-2" />
      )}
      {isLoading ? 'Processing...' : label}
    </Button>
  );
};