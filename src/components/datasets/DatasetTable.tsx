import React from 'react';
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [pageInput, setPageInput] = React.useState("");
  const itemsPerPage = 7;
  const totalPages = Math.ceil(tables.length / itemsPerPage);
  
  const startIndex = currentPage * itemsPerPage;
  const displayedTables = tables.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      setPageInput((currentPage + 2).toString());
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setPageInput((currentPage).toString());
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handlePageInputBlur = () => {
    const pageNumber = parseInt(pageInput) - 1;
    if (!isNaN(pageNumber) && pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    } else {
      setPageInput((currentPage + 1).toString());
    }
  };

  React.useEffect(() => {
    setPageInput((currentPage + 1).toString());
  }, [currentPage]);

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
          <div className="flex items-center space-x-2">
            <span className="text-sm">Page</span>
            <Input
              className="w-16 text-center"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={(e) => e.key === 'Enter' && handlePageInputBlur()}
            />
            <span className="text-sm">of {totalPages}</span>
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