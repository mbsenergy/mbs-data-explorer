import type { ColumnDef } from "@tanstack/react-table";

export const processCsvFile = async (file: File): Promise<{
  data: any[];
  columns: ColumnDef<any>[];
}> => {
  const text = await file.text();
  const rows = text.split('\n').filter(row => row.trim());
  
  if (rows.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse headers (first row)
  const headers = rows[0].split(',').map(h => h.trim());

  if (headers.length === 0) {
    throw new Error('No columns found in CSV file');
  }

  // Parse data rows
  const data = rows.slice(1).map(row => {
    const values = row.split(',');
    return headers.reduce((obj, header, index) => {
      // Handle quoted values
      let value = values[index] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      obj[header] = value.trim();
      return obj;
    }, {} as Record<string, string>);
  }).filter(row => Object.values(row).some(value => value !== ''));

  if (data.length === 0) {
    throw new Error('No valid data rows found in CSV file');
  }

  // Create column definitions
  const columns: ColumnDef<any>[] = headers.map((header) => ({
    id: header,
    accessorKey: header,
    header: header,
  }));

  return { data, columns };
};