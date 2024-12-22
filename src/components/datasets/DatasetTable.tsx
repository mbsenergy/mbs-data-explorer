import React from 'react';
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tables.length / itemsPerPage);
  
  const startIndex = currentPage * itemsPerPage;
  const displayedTables = tables.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
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
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, tables.length)} of {tables.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};