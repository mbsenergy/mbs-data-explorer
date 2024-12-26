import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Database } from "lucide-react";
import { DataControlsProps } from "@/types/visualize";
import { SqlQueryBox } from "@/components/datasets/SqlQueryBox";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

export const DataControls = ({ onUpload, onExecuteQuery, isLoading, selectedTable }: DataControlsProps) => {
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let data: any[] = [];

      if (file.name.endsWith('.csv')) {
        // Handle CSV files
        const text = await file.text();
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        data = rows.slice(1)
          .filter(row => row.trim())
          .map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, i) => {
              obj[header] = values[i]?.trim();
              return obj;
            }, {} as Record<string, string>);
          });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Handle Excel files
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload either an Excel (.xlsx, .xls) or CSV file",
        });
        return;
      }

      // Create a synthetic event with the processed data
      const syntheticEvent = {
        target: {
          files: [new File([JSON.stringify(data)], file.name, { type: file.type })],
          result: data
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onUpload(syntheticEvent);

      toast({
        title: "Success",
        description: `Loaded ${data.length} rows of data from ${file.name}`,
      });
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process file",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 metallic-card">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Upload File</h2>
        </div>
        <Input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          disabled={isLoading}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Accepts Excel (.xlsx, .xls) and CSV files
        </p>
      </Card>
    </div>
  );
};