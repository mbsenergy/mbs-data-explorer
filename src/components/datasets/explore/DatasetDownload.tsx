import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetDownloadProps {
  selectedDataset: TableNames | null;
  selectedColumns: string[];
  selectedColumn: string;
  searchTerm: string;
  data: any[];
}

export const DatasetDownload = ({
  selectedDataset,
  selectedColumns,
  selectedColumn,
  searchTerm,
  data
}: DatasetDownloadProps) => {
  const handleDownload = async () => {
    if (!selectedDataset || !selectedColumns.length) {
      toast.error("Please select columns to download");
      return;
    }

    // Filter and prepare data for download
    const filteredData = data.filter((item) =>
      selectedColumn
        ? String(item[selectedColumn])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : Object.entries(item)
            .filter(([key]) => !key.startsWith('md_'))
            .some(([_, value]) => 
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    // Only include selected columns
    const processedData = filteredData.map(row => {
      const processedRow: Record<string, any> = {};
      selectedColumns.forEach(col => {
        processedRow[col] = row[col];
      });
      return processedRow;
    });

    // Create and download CSV
    const csvContent = "data:text/csv;charset=utf-8," 
      + [
          selectedColumns.join(","),
          ...processedData.map(row => 
            selectedColumns.map(col => `"${row[col] || ""}"`).join(",")
          )
        ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedDataset}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Sample data downloaded successfully");
  };

  return (
    <Button 
      variant="outline"
      onClick={handleDownload}
      className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
    >
      <Download className="h-4 w-4 mr-2" />
      Sample
    </Button>
  );
};