import type { ColumnDef } from "@tanstack/react-table";
import type { DataPoint } from "@/types/visualize";

const inferColumnType = (value: string): 'number' | 'date' | 'text' => {
  // Try parsing as number first
  if (!isNaN(Number(value)) && value.trim() !== '') {
    return 'number';
  }
  
  // Try parsing as date
  const dateValue = new Date(value);
  if (!isNaN(dateValue.getTime()) && value.includes('-')) {
    return 'date';
  }
  
  // Default to text
  return 'text';
};

const convertValue = (value: string, type: 'number' | 'date' | 'text'): any => {
  if (value === null || value === undefined || value.trim() === '') {
    return null;
  }

  switch (type) {
    case 'number':
      const num = Number(value);
      return isNaN(num) ? null : num;
    case 'date':
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    default:
      return value;
  }
};

export const processCsvFile = async (file: File): Promise<{
  data: DataPoint[];
  columns: ColumnDef<any>[];
}> => {
  const text = await file.text();
  const rows = text.split('\n').filter(row => row.trim());
  
  if (rows.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse headers (first row)
  const headers = rows[0].split(',').map(h => h.trim().replace(/["']/g, ''));

  if (headers.length === 0) {
    throw new Error('No columns found in CSV file');
  }

  // Get a sample row to infer types
  const sampleRow = rows[1]?.split(',').map(cell => cell.trim().replace(/["']/g, '')) || [];
  const columnTypes = sampleRow.map((value, index) => ({
    header: headers[index],
    type: inferColumnType(value)
  }));

  // Parse data rows
  const data = rows.slice(1).map(row => {
    const values = row.split(',');
    return headers.reduce((obj, header, index) => {
      let value = values[index] || '';
      // Remove quotes and trim
      value = value.replace(/["']/g, '').trim();
      // Convert value based on inferred type
      obj[header] = convertValue(value, columnTypes[index].type);
      return obj;
    }, {} as Record<string, any>);
  }).filter(row => Object.values(row).some(value => value !== null));

  if (data.length === 0) {
    throw new Error('No valid data rows found in CSV file');
  }

  // Create column definitions with proper types
  const columns: ColumnDef<any>[] = columnTypes.map(({ header, type }) => ({
    id: header,
    accessorKey: header,
    header: header,
    cell: (info: any) => {
      const value = info.getValue();
      if (value === null) return 'NULL';
      if (type === 'date' && value instanceof Date) {
        return value.toLocaleDateString();
      }
      return String(value);
    }
  }));

  return { data, columns };
};