import * as XLSX from 'xlsx';
import type { ColumnDef } from "@tanstack/react-table";

export const processExcelFile = async (file: File, selectedSheet: string, headerRow: string): Promise<{
  data: any[];
  columns: ColumnDef<any>[];
}> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const worksheet = workbook.Sheets[selectedSheet];
  
  if (!worksheet) {
    throw new Error('Selected sheet not found');
  }

  // Convert header row number to 0-based index
  const headerRowIndex = parseInt(headerRow) - 1;
  
  // Read the data with the specified header row
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    range: headerRowIndex,
    raw: false,
    defval: '',
    blankrows: false
  });

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error('No data found in the selected sheet');
  }

  // Extract column headers from the first row
  const headers = Object.keys(jsonData[0]);

  // Create column definitions
  const columns: ColumnDef<any>[] = headers.map((header) => ({
    id: header,
    accessorKey: header,
    header: header,
  }));

  // Filter out empty rows and ensure all rows have the same structure
  const cleanData = jsonData.filter(row => {
    const hasValues = Object.values(row).some(value => value !== '');
    const hasAllColumns = headers.every(header => header in row);
    return hasValues && hasAllColumns;
  });

  if (cleanData.length === 0) {
    throw new Error('No valid data rows found after processing');
  }

  return { 
    data: cleanData, 
    columns 
  };
};