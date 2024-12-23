import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { TableInfo } from "./types";

interface DatasetTableRowProps {
  table: TableInfo;
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  isFavorite: boolean;
  isSelected?: boolean;
}

export const DatasetTableRow = ({ 
  table, 
  onPreview, 
  onDownload,
  onSelect,
  onToggleFavorite,
  isFavorite,
  isSelected,
}: DatasetTableRowProps) => {
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const match = table.tablename.match(/^([A-Z]{2})(\d+)_(.+)/);
  const [_, field, type, name] = match || ["", "", "", table.tablename];

  const handleDownload = () => {
    setIsDownloadDialogOpen(true);
  };

  const handleConfirmDownload = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to download datasets.",
      });
      return;
    }

    try {
      // Track analytics first
      const { error: analyticsError } = await supabase
        .from("analytics")
        .insert({
          user_id: user.id,
          dataset_name: table.tablename,
          is_custom_query: false,
        });

      if (analyticsError) {
        console.error("Error tracking download:", analyticsError);
      }

      // Fetch sample data
      const { data, error } = await supabase
        .from(table.tablename as any)
        .select('*')
        .limit(1000);

      if (error) throw error;

      if (!data || !data.length) {
        throw new Error("No data available for download");
      }

      // Create CSV content
      const headers = Object.keys(data[0]).filter(key => !key.startsWith('md_')).join(',');
      const rows = data.map(row => {
        return Object.entries(row)
          .filter(([key]) => !key.startsWith('md_'))
          .map(([_, value]) => {
            if (value === null) return '';
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value;
          })
          .join(',');
      });
      const csv = [headers, ...rows].join('\n');

      // Create and trigger download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${table.tablename}_sample.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Dataset sample downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Error downloading dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to download dataset.",
      });
    } finally {
      setIsDownloadDialogOpen(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{name}</TableCell>
        <TableCell>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium field-pill-${field}`}>
            {field}
          </span>
        </TableCell>
        <TableCell>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium type-pill-${type}`}>
            {type}
          </span>
        </TableCell>
        <TableCell className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={isSelected ? 
              "bg-[#1E293B] text-white hover:bg-[#1E293B]/90" : 
              "bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"}
            onClick={() => onSelect(table.tablename)}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(table.tablename)}
            className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(table.tablename)}
            className={isFavorite ? "text-yellow-400" : "text-gray-400"}
          >
            <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => setIsDownloadDialogOpen(false)}
        onConfirm={handleConfirmDownload}
        title="Download Dataset"
        description="Are you sure you want to download this dataset?"
      />
    </>
  );
};