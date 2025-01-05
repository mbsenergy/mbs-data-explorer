import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetPagination } from "./explore/DatasetPagination";
import { DatasetStats } from "./explore/DatasetStats";
import { DatasetTable } from "./explore/DatasetTable";
import { DatasetControls } from "./explore/DatasetControls";
import { DatasetColumnSelect } from "./explore/DatasetColumnSelect";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setData, setColumns, setSelectedColumns } from "@/store/slices/datasetSlice";
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
  const dispatch = useAppDispatch();
  const { data: reduxData, columns: reduxColumns } = useAppSelector(state => state.dataset);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData
  } = useDatasetData(selectedDataset);

  useEffect(() => {
    if (data.length > 0) {
      dispatch(setData(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (columns.length > 0) {
      dispatch(setColumns(columns));
      dispatch(setSelectedColumns(columns));
      onColumnsChange(columns);
    }
  }, [columns, dispatch, onColumnsChange]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      await loadData();
      if (onLoad) {
        onLoad(selectedDataset);
      }
    }
  };

  const filteredData = reduxData.filter((item) =>
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
    const selectedColumns = useAppSelector(state => state.dataset.selectedColumns);
    const newColumns = selectedColumns.includes(column)
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    dispatch(setSelectedColumns(newColumns));
    onColumnsChange(newColumns);
  };

  const handlePageChange = async (newPage: number) => {
    const pageData = await fetchPage(newPage, itemsPerPage);
    if (pageData) {
      setCurrentPage(newPage);
      dispatch(setData(pageData));
    }
  };

  const getLastUpdate = (data: any[]) => {
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const item = data[0] as Record<string, unknown>;
      return item.md_last_update as string | null;
    }
    return null;
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
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLoad}
              className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
            >
              Load
            </Button>
          )}
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '#sample'}
            className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
          >
            Sample
          </Button>
        </div>
      </div>
      
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={reduxColumns.length}
        filteredRows={filteredData.length}
        lastUpdate={getLastUpdate(reduxData)}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading dataset...</p>
        </div>
      ) : (
        <>
          <DatasetControls
            columns={reduxColumns}
            searchTerm={searchTerm}
            selectedColumn={selectedColumn}
            onSearchChange={setSearchTerm}
            onColumnChange={setSelectedColumn}
          />

          <DatasetColumnSelect
            columns={reduxColumns}
            selectedColumns={useAppSelector(state => state.dataset.selectedColumns)}
            onColumnSelect={handleColumnSelect}
          />

          <DatasetTable
            columns={reduxColumns}
            data={paginatedData}
            selectedColumns={useAppSelector(state => state.dataset.selectedColumns)}
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