import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatasetPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DatasetPagination = ({ 
  currentPage, 
  totalPages,
  onPageChange 
}: DatasetPaginationProps) => {
  const [pageInput, setPageInput] = React.useState(String(currentPage + 1));

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInput) - 1;
    if (!isNaN(page) && page >= 0 && page < totalPages) {
      onPageChange(page);
    } else {
      setPageInput(String(currentPage + 1));
    }
  };

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};