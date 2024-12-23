import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();
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

  const handleExport = async () => {
    if (!selectedDataset || !data.length) return;
    
    try {
      // For export, fetch all data in chunks
      const chunkSize = 1000;
      let allData = [];
      let currentOffset = 0;
      
      while (true) {
        const { data: chunk, error } = await supabase
          .from(selectedDataset)
          .select(selectedColumns.join(','))
          .range(currentOffset, currentOffset + chunkSize - 1);
        
        if (error) throw error;
        if (!chunk.length) break;
        
        allData = [...allData, ...chunk];
        if (chunk.length < chunkSize) break;
        currentOffset += chunkSize;
      }

      const csv = [
        selectedColumns.join(','),
        ...allData.map(row => 
          selectedColumns.map(col => String(row[col])).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDataset}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Dataset exported successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error exporting data",
        description: error.message,
        variant: "destructive",
      });
    }
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
          <h2 className="text-2xl font-semibold">Explore & Export</h2>
          {selectedDataset && (
            <p className="text-muted-foreground">
              Selected dataset: <span className="font-medium">{selectedDataset}</span>
            </p>
          )}
        </div>
        <Button 
          onClick={handleExport}
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
          disabled={!selectedDataset || !data.length}
        >
          Export Dataset
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