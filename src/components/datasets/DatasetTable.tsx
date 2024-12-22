import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { DatasetTableRow } from "./DatasetTableRow";
import type { TableInfo } from "./types";

interface DatasetTableProps {
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  favorites: Set<string>;
}

export const DatasetTable = ({ 
  tables, 
  onPreview, 
  onDownload, 
  onSelect,
  onToggleFavorite,
  favorites
}: DatasetTableProps) => {
  // Only show first 10 tables
  const displayedTables = tables.slice(0, 10);

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <th className="px-4 py-3 font-bold text-lg">Dataset Name</th>
            <th className="px-4 py-3 font-bold text-lg">Field</th>
            <th className="px-4 py-3 font-bold text-lg">Type</th>
            <th className="px-4 py-3 font-bold text-lg">Actions</th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTables.map((table) => (
            <DatasetTableRow
              key={table.tablename}
              table={table}
              onPreview={onPreview}
              onDownload={onDownload}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.has(table.tablename)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};