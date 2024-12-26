import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { DataControlsProps } from "@/types/visualize";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export const DataControls = ({ onUpload, isLoading, selectedTable }: DataControlsProps) => {
  const { toast } = useToast();
  const [fileType, setFileType] = useState<'excel' | 'csv'>('excel');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let data: any[] = [];
      const isExcelFile = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      const isCsvFile = file.name.endsWith('.csv');

      if (!isExcelFile && !isCsvFile) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `Please upload ${fileType === 'excel' ? 'an Excel (.xlsx, .xls)' : 'a CSV'} file`,
        });
        return;
      }

      if (fileType === 'excel' && !isExcelFile) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an Excel file (.xlsx, .xls)",
        });
        return;
      }

      if (fileType === 'csv' && !isCsvFile) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a CSV file",
        });
        return;
      }

      if (isCsvFile) {
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
      } else if (isExcelFile) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      }

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Upload File</h2>
          </div>
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
            <Toggle
              pressed={fileType === 'excel'}
              onPressedChange={() => setFileType('excel')}
              className="data-[state=on]:bg-primary"
            >
              Excel
            </Toggle>
            <Toggle
              pressed={fileType === 'csv'}
              onPressedChange={() => setFileType('csv')}
              className="data-[state=on]:bg-primary"
            >
              CSV
            </Toggle>
          </div>
        </div>
        <Input
          type="file"
          accept={fileType === 'excel' ? '.xlsx,.xls' : '.csv'}
          onChange={handleFileChange}
          disabled={isLoading}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {fileType === 'excel' 
            ? 'Accepts Excel files (.xlsx, .xls)' 
            : 'Accepts CSV files (.csv)'}
        </p>
      </Card>
    </div>
  );
};