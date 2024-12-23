import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatasetPagination } from "./explore/DatasetPagination";
import { DatasetStats } from "./explore/DatasetStats";
import { DatasetTable } from "./explore/DatasetTable";
import { DatasetControls } from "./explore/DatasetControls";
import { useDatasetData } from "@/hooks/useDatasetData";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreProps {
  selectedDataset: TableNames | null;
}

export const DatasetExplore = ({ selectedDataset }: DatasetExploreProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage
  } = useDatasetData(selectedDataset);

  const filteredData = data.filter((item) =>
    selectedColumn
      ? String(item[selectedColumn])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : Object.entries(item)
          .filter(([key]) => !key.startsWith('md_'))
          .some(([_, value]) => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleColumnSelect = (column: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column);
      }
      return [...prev, column];
    });
  };

  const handlePageChange = async (newPage: number) => {
    const pageData = await fetchPage(newPage, itemsPerPage);
    if (pageData) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="p-6 space-y-6" data-explore-section>
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Explore</h2>
          {selectedDataset && (
            <p className="text-muted-foreground">
              Selected dataset: <span className="font-medium">{selectedDataset}</span>
            </p>
          )}
        </div>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '#sample'}
          className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
        >
          Sample
        </Button>
      </div>
      
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data[0]?.md_last_update || null}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <>
          <DatasetControls
            columns={columns}
            searchTerm={searchTerm}
            selectedColumn={selectedColumn}
            onSearchChange={setSearchTerm}
            onColumnChange={setSelectedColumn}
          />

          <div className="space-y-2">
            <Label>Columns to display</Label>
            <div className="flex flex-wrap gap-2">
              {columns.map((col) => (
                <label
                  key={col}
                  className="inline-flex items-center space-x-2 bg-card border border-border rounded-md px-3 py-1 cursor-pointer hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col)}
                    onChange={() => handleColumnSelect(col)}
                    className="rounded border-gray-300"
                  />
                  <span>{col}</span>
                </label>
              ))}
            </div>
          </div>

          <DatasetTable
            columns={columns}
            data={paginatedData}
            selectedColumns={selectedColumns}
          />

          <DatasetPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
};