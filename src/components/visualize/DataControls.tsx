import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { processExcelFile } from "./file-processing/ExcelProcessor";
import { processCsvFile } from "./file-processing/CsvProcessor";
import { FileTypeToggle } from "./file-upload/FileTypeToggle";
import { ExcelSheetSelector } from "./file-upload/ExcelSheetSelector";
import { FileUploadButton } from "./file-upload/FileUploadButton";
import type { DataControlsProps } from "@/types/visualize";

export const DataControls = ({ onUpload, isLoading: parentIsLoading, selectedTable }: DataControlsProps) => {
  const { toast } = useToast();
  const [fileType, setFileType] = useState<'excel' | 'csv'>('excel');
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [headerRow, setHeaderRow] = useState<string>('1');
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (fileType === 'excel' && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an Excel file (.xlsx or .xls)",
      });
      return;
    }

    if (fileType === 'csv' && !file.name.match(/\.csv$/i)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a CSV file (.csv)",
      });
      return;
    }

    setSelectedFile(file);
    setWorkbook(null);
    setAvailableSheets([]);
    setSelectedSheet('');
    setIsFileUploaded(false);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file first",
      });
      return;
    }

    setIsUploadingFile(true);
    try {
      if (fileType === 'excel') {
        const buffer = await selectedFile.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const sheets = wb.SheetNames;
        
        if (sheets.length === 0) {
          throw new Error('No sheets found in Excel file');
        }
        
        setWorkbook(wb);
        setAvailableSheets(sheets);
        setSelectedSheet(sheets[0]);
        setIsFileUploaded(true);
        
        toast({
          title: "Success",
          description: "File uploaded successfully. Please select a sheet to continue.",
        });
      } else {
        // For CSV, process directly
        await handleProcessData();
      }
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process file",
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleProcessData = async () => {
    if (!selectedFile) return;

    setIsLoadingSheet(true);
    try {
      let result;
      
      if (fileType === 'excel') {
        if (!workbook || !selectedSheet) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please select a sheet",
          });
          return;
        }
        
        result = await processExcelFile(selectedFile, selectedSheet, headerRow);
      } else {
        result = await processCsvFile(selectedFile);
      }

      const syntheticEvent = {
        target: {
          files: [new File([JSON.stringify(result.data)], selectedFile.name, { type: selectedFile.type })],
          result: result
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onUpload(syntheticEvent);

      toast({
        title: "Success",
        description: `Loaded ${result.data.length} rows of data from ${selectedFile.name}`,
      });
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process file",
      });
    } finally {
      setIsLoadingSheet(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 metallic-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <h2 className="text-sm font-semibold">Upload Local File</h2>
          </div>
          <FileTypeToggle 
            fileType={fileType}
            onTypeChange={setFileType}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium">Choose File</label>
            <Input
              type="file"
              accept={fileType === 'excel' ? '.xlsx,.xls' : '.csv'}
              onChange={handleFileSelect}
              disabled={isUploadingFile || parentIsLoading}
              className="text-xs cursor-pointer"
            />
          </div>

          {selectedFile && !isFileUploaded && (
            <FileUploadButton 
              onClick={handleUploadFile}
              isLoading={isUploadingFile}
              label="Upload File"
            />
          )}

          {fileType === 'excel' && isFileUploaded && availableSheets.length > 0 && (
            <div className="space-y-4">
              <ExcelSheetSelector
                sheets={availableSheets}
                selectedSheet={selectedSheet}
                onSheetSelect={setSelectedSheet}
                headerRow={headerRow}
                onHeaderRowChange={setHeaderRow}
              />

              <FileUploadButton 
                onClick={handleProcessData}
                isLoading={isLoadingSheet}
                label="Load Sheet Data"
              />
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          {fileType === 'excel' 
            ? 'Accepts Excel files (.xlsx, .xls)' 
            : 'Accepts CSV files (.csv)'}
        </p>
      </Card>
    </div>
  );
};