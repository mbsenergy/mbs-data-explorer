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

  // Parse data rows
  const data = rows.slice(1).map(row => {
    const values = row.split(',').map(cell => cell.trim());
    return headers.reduce((obj, header, index) => {
      // Handle quoted values
      let value = values[index] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      obj[header] = value;
      return obj;
    }, {} as Record<string, string>);
  });

  // Create column definitions
  const columns: ColumnDef<any>[] = headers.map((header) => ({
    id: header,
    accessorKey: header,
    header: header,
  }));

  return { data, columns };
};