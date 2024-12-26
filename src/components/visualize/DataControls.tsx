import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { DataControlsProps } from "@/types/visualize";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

export const DataControls = ({ onUpload, isLoading, selectedTable }: DataControlsProps) => {
  const { toast } = useToast();
  const [fileType, setFileType] = useState<'excel' | 'csv'>('excel');
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [headerRow, setHeaderRow] = useState<string>('1');
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let data: any[] = [];
      
      if (fileType === 'excel') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        // If sheets haven't been loaded yet, load them and select the first one
        if (!selectedSheet) {
          const sheets = workbook.SheetNames;
          setAvailableSheets(sheets);
          setSelectedSheet(sheets[0]);
          return; // Wait for user to select sheet
        }

        const worksheet = workbook.Sheets[selectedSheet];
        const headerRowNum = parseInt(headerRow) - 1; // Convert to 0-based index
        
        // Read data starting from specified header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          range: headerRowNum,
          raw: false,
          defval: ''
        });
        
        data = jsonData;
      } else {
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

        {fileType === 'excel' && (
          <div className="space-y-4 mb-4">
            {availableSheets.length > 0 && (
              <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sheet" />
                </SelectTrigger>
                <SelectContent>
                  {availableSheets.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                      {sheet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Select value={headerRow} onValueChange={setHeaderRow}>
              <SelectTrigger>
                <SelectValue placeholder="Select header row" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Row {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Input
          type="file"
          accept={fileType === 'excel' ? '.xlsx,.xls' : '.csv'}
          onChange={handleFileChange}
          disabled={isLoading || (fileType === 'excel' && availableSheets.length > 0 && !selectedSheet)}
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