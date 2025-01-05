import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useDatasetData } from "@/hooks/useDatasetData";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setData, setColumns, setSelectedColumns } from "@/store/slices/datasetSlice";
import { DatasetExploreHeader } from "./explore/DatasetExploreHeader";
import { DatasetExploreContent } from "./explore/DatasetExploreContent";
import type { Database } from "@/integrations/supabase/types";
import type { ColumnDef } from "@tanstack/react-table";

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
    columns: rawColumns,
    totalRowCount,
    isLoading,
    fetchPage,
    loadData
  } = useDatasetData(selectedDataset);

  // Convert raw column names to ColumnDef objects with proper typing
  const columns: ColumnDef<any, any>[] = rawColumns.map(col => ({
    id: col,
    accessorFn: (row: any) => row[col],
    header: col,
  }));

  // Extract column names as strings for components that expect string arrays
  const columnNames = columns.map(col => col.id as string);

  useEffect(() => {
    if (data.length > 0) {
      dispatch(setData(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (columns.length > 0) {
      dispatch(setColumns(columns));
      dispatch(setSelectedColumns(columnNames));
      onColumnsChange(columnNames);
    }
  }, [columns, columnNames, dispatch, onColumnsChange]);

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

  return (
    <Card className="p-6 space-y-6">
      <DatasetExploreHeader 
        selectedDataset={selectedDataset}
        onLoad={handleLoad}
      />
      
      <DatasetExploreContent
        isLoading={isLoading}
        data={paginatedData}
        columns={columns}
        columnNames={columnNames}
        selectedColumn={selectedColumn}
        searchTerm={searchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        selectedColumns={useAppSelector(state => state.dataset.selectedColumns)}
        totalRowCount={totalRowCount}
        onSearchChange={setSearchTerm}
        onColumnChange={setSelectedColumn}
        onColumnSelect={handleColumnSelect}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};