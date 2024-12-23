import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatasetPagination } from "./explore/DatasetPagination";
import { DatasetStats } from "./explore/DatasetStats";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreProps {
  selectedDataset: TableNames | null;
}

export const DatasetExplore = ({ selectedDataset }: DatasetExploreProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDataset) {
        setData([]);
        setColumns([]);
        setTotalRowCount(0);
        return;
      }

      // Fetch total count first
      const { count, error: countError } = await supabase
        .from(selectedDataset)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        toast({
          title: "Error fetching count",
          description: countError.message,
          variant: "destructive",
        });
        return;
      }

      setTotalRowCount(count || 0);

      // Then fetch the actual data
      const { data: tableData, error } = await supabase
        .from(selectedDataset)
        .select("*")
        .limit(1000); // Keep limit for actual data display

      if (error) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setData(tableData);
        if (tableData.length > 0) {
          const filteredColumns = Object.keys(tableData[0]).filter(
            col => !col.startsWith('md_')
          );
          setColumns(filteredColumns);
          setSelectedColumns(filteredColumns);
        }
      }
    };

    fetchData();
  }, [selectedDataset, toast]);

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
    
    const csv = [
      selectedColumns.join(','),
      ...filteredData.map(row => 
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
        totalRows={totalRowCount} // Now using the accurate total count
        columnsCount={columns.length}
        filteredRows={filteredData.length}
        lastUpdate={data[0]?.md_last_update || null}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search in data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="column">Column</Label>
          <select
            id="column"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="">All columns</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

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

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {selectedColumns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {selectedColumns.map((col) => (
                    <TableCell key={col} className="whitespace-nowrap">
                      {String(item[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DatasetPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
};