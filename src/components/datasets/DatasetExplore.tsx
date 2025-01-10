import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetStats } from "./explore/DatasetStats";
import { DatasetTable } from "./explore/DatasetTable";
import { DatasetControls } from "./explore/DatasetControls";
import { DatasetColumnSelect } from "./explore/DatasetColumnSelect";
import { useDatasetData } from "@/hooks/useDatasetData";
import type { Database } from "@/integrations/supabase/types";
import { Download, Database as DatabaseIcon, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("all_columns");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [showQueryModal, setShowQueryModal] = useState(false);

  const {
    data,
    columns,
    totalRowCount,
    isLoading,
    loadData,
    queryText
  } = useDatasetData(selectedDataset);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  const handleLoad = async () => {
    if (selectedDataset && loadData) {
      try {
        // Build filter conditions based on search term and selected column
        let filterConditions = "";
        if (searchTerm) {
          if (selectedColumn === "all_columns") {
            // For all columns, we need to create an OR condition for each column
            filterConditions = columns
              .filter(col => !col.startsWith('md_'))
              .map(col => `${col}::text ILIKE '%${searchTerm}%'`)
              .join(' OR ');
            if (filterConditions) {
              filterConditions = `(${filterConditions})`;
            }
          } else {
            // For a specific column
            filterConditions = `${selectedColumn}::text ILIKE '%${searchTerm}%'`;
          }
        }

        await loadData(filterConditions);
        if (onLoad) {
          onLoad(selectedDataset);
        }
        toast({
          title: "Success",
          description: "Data retrieved successfully"
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load data"
        });
      }
    }
  };

  const handleExport = async () => {
    if (!data.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data available to export"
      });
      return;
    }

    try {
      const headers = selectedColumns.join(',');
      const rows = data.map(row => 
        selectedColumns.map(col => {
          const value = row[col];
          if (value === null) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDataset}_export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Data exported successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export data"
      });
    }
  };

  const filteredData = data.filter((item) =>
    selectedColumn === "all_columns"
      ? Object.entries(item)
          .filter(([key]) => !key.startsWith('md_'))
          .some(([_, value]) => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
      : String(item[selectedColumn])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );

  const handleColumnSelect = (column: string) => {
    const newColumns = selectedColumns.includes(column)
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newColumns);
    onColumnsChange(newColumns);
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
              variant="default"
              size="sm"
              onClick={handleLoad}
              disabled={isLoading}
              className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
            >
              <DatabaseIcon className="h-4 w-4 mr-2" />
              Retrieve
            </Button>
          )}
          <Button 
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!data.length || isLoading}
            className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQueryModal(true)}
            disabled={isLoading}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Code className="h-4 w-4 mr-2" />
            Show Query
          </Button>
        </div>
      </div>
      
      <DatasetStats 
        totalRows={totalRowCount}
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={getLastUpdate(data)}
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

          <DatasetColumnSelect
            columns={columns}
            selectedColumns={selectedColumns}
            onColumnSelect={handleColumnSelect}
          />

          <DatasetTable
            columns={columns}
            data={filteredData}
            selectedColumns={selectedColumns}
          />
        </>
      )}
    </Card>
  );
};