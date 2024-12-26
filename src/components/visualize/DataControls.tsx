import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataControlsProps } from "@/types/visualize";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

export const DataControls = ({ onUpload, isLoading, selectedTable }: DataControlsProps) => {
  const { toast } = useToast();
  const [fileType, setFileType] = useState<'excel' | 'csv'>('excel');
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [headerRow, setHeaderRow] = useState<string>('1');
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    if (fileType === 'excel') {
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheets = workbook.SheetNames;
        setAvailableSheets(sheets);
        setSelectedSheet(sheets[0]);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read Excel file",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file first",
      });
      return;
    }

    try {
      let data: any[] = [];
      
      if (fileType === 'excel') {
        if (!selectedSheet) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please select a sheet",
          });
          return;
        }

        const buffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const worksheet = workbook.Sheets[selectedSheet];
        const headerRowNum = parseInt(headerRow) - 1;
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          range: headerRowNum,
          raw: false,
          defval: ''
        });
        
        data = jsonData;
      } else {
        const text = await selectedFile.text();
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
      }

      const syntheticEvent = {
        target: {
          files: [new File([JSON.stringify(data)], selectedFile.name, { type: selectedFile.type })],
          result: data
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onUpload(syntheticEvent);

      toast({
        title: "Success",
        description: `Loaded ${data.length} rows of data from ${selectedFile.name}`,
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
            <Upload className="h-4 w-4" />
            <h2 className="text-lg font-semibold">Upload File</h2>
          </div>
          <div className="flex items-center gap-2 bg-secondary/20 rounded-lg p-1">
            <Toggle
              pressed={fileType === 'excel'}
              onPressedChange={() => setFileType('excel')}
              className="text-xs data-[state=on]:bg-primary h-7"
            >
              Excel
            </Toggle>
            <Toggle
              pressed={fileType === 'csv'}
              onPressedChange={() => setFileType('csv')}
              className="text-xs data-[state=on]:bg-primary h-7"
            >
              CSV
            </Toggle>
          </div>
        </div>

        {fileType === 'excel' && (
          <div className="space-y-3 mb-4">
            {availableSheets.length > 0 && (
              <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select a sheet" />
                </SelectTrigger>
                <SelectContent>
                  {availableSheets.map((sheet) => (
                    <SelectItem key={sheet} value={sheet} className="text-sm">
                      {sheet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Select value={headerRow} onValueChange={setHeaderRow}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select header row" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-sm">
                    Row {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <Input
            type="file"
            accept={fileType === 'excel' ? '.xlsx,.xls' : '.csv'}
            onChange={handleFileSelect}
            disabled={isLoading}
            className="text-sm cursor-pointer"
          />
          <Button 
            onClick={handleUpload}
            disabled={isLoading || (fileType === 'excel' && !selectedSheet) || !selectedFile}
            className="w-full bg-primary/20 hover:bg-primary/30"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {fileType === 'excel' 
            ? 'Accepts Excel files (.xlsx, .xls)' 
            : 'Accepts CSV files (.csv)'}
        </p>
      </Card>
    </div>
  );
};