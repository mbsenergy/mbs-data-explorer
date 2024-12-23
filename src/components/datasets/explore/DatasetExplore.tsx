import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Database, Search } from "lucide-react";
import { DatasetStats } from "./DatasetStats";
import { DatasetHeader } from "./DatasetHeader";
import { DatasetContent } from "./DatasetContent";
import { DatasetQueryModal } from "./DatasetQueryModal";
import { useDatasetData } from "@/hooks/useDatasetData";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreProps {
  selectedDataset: TableNames | null;
  onColumnsChange: (columns: string[]) => void;
  onLoad?: (tableName: string) => void;
}

export const DatasetExplore = ({ 
  selectedDataset, 
  onColumnsChange,
  onLoad 
}: DatasetExploreProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const itemsPerPage = 10;

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData,
    currentQuery
  } = useDatasetData(selectedDataset);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData(selectedDataset);
      if (onLoad) {
        onLoad(selectedDataset);
      }
    }
  };

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
    const newColumns = selectedColumns.includes(column)
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newColumns);
    onColumnsChange(newColumns);
  };

  const handlePageChange = async (newPage: number) => {
    const pageData = await fetchPage(newPage, itemsPerPage);
    if (pageData) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Explore</h2>
          {selectedDataset && (
            <p className="text-muted-foreground">
              Selected dataset: <span className="font-medium">{selectedDataset}</span>
            </p>
          )}
        </div>
        <div className="space-x-2">
          {onLoad && (
            <>
              <Button 
                variant="outline"
                onClick={handleLoad}
                className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
              >
                <Database className="h-4 w-4 mr-2" />
                Retrieve
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '#explore'}
                className="bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30"
              >
                <Search className="h-4 w-4 mr-2" />
                Explore
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowQueryModal(true)}
                className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Query
              </Button>
            </>
          )}
        </div>
      </div>
      
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data[0]?.md_last_update || null}
      />

      <DatasetContent
        isLoading={isLoading}
        columns={columns}
        searchTerm={searchTerm}
        selectedColumn={selectedColumn}
        selectedColumns={selectedColumns}
        paginatedData={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchChange={setSearchTerm}
        onColumnChange={setSelectedColumn}
        onColumnSelect={handleColumnSelect}
        onPageChange={handlePageChange}
        onLoad={onLoad}
        selectedDataset={selectedDataset}
      />

      <DatasetQueryModal
        isOpen={showQueryModal}
        onClose={() => setShowQueryModal(false)}
        query={currentQuery}
      />
    </Card>
  );
};