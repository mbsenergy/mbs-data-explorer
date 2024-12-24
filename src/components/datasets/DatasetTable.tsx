import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatasetTableRow } from "./DatasetTableRow";
import type { TableInfo } from "./types";
import { Button } from "@/components/ui/button"; 
import { Download, Eye, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatasetTableProps {
  tables: TableInfo[];
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  favorites: Set<string>;
  selectedDataset?: string;
}

export const DatasetTable = ({
  tables,
  onPreview,
  onDownload,
  onSelect,
  onToggleFavorite,
  favorites,
  selectedDataset,
}: DatasetTableProps) => {
  return (
    <div className="border rounded-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <DatasetTableRow
                key={table.tablename}
                table={table}
                onPreview={onPreview}
                onDownload={onDownload}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.has(table.tablename)}
                isSelected={selectedDataset === table.tablename}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};