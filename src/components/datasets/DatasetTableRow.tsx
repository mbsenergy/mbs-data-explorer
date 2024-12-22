import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star } from "lucide-react";
import type { TableInfo } from "./types";

interface DatasetTableRowProps {
  table: TableInfo;
  onPreview: (tableName: string) => void;
  onDownload: (tableName: string) => void;
  onSelect: (tableName: string) => void;
  onToggleFavorite: (tableName: string) => void;
  isFavorite: boolean;
}

export const DatasetTableRow = ({ 
  table, 
  onPreview, 
  onDownload, 
  onSelect,
  onToggleFavorite,
  isFavorite 
}: DatasetTableRowProps) => {
  const match = table.tablename.match(/^([A-Z]{2})(\d+)_(.+)/);
  const [_, field, type, name] = match || ["", "", "", table.tablename];

  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F97316] text-white">
          {field}
        </span>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEC6A1] text-gray-900">
          {type}
        </span>
      </TableCell>
      <TableCell className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-corporate-blue hover:bg-corporate-blue/90 text-white"
          onClick={() => onSelect(table.tablename)}
        >
          Select
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(table.tablename)}
          className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(table.tablename)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleFavorite(table.tablename)}
          className={isFavorite ? "text-yellow-400" : "text-gray-400"}
        >
          <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
      </TableCell>
    </TableRow>
  );
};