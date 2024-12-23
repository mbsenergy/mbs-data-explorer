import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { DatasetFilters } from "./explore/DatasetFilters";
import { DatasetStats } from "./explore/DatasetStats";
import { VirtualizedTable } from "./explore/VirtualizedTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreProps {
  selectedDataset?: string;
}

export const DatasetExplore = ({ selectedDataset }: DatasetExploreProps) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [filteredRows, setFilteredRows] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<ColumnDef<any>[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedDataset) {
      fetchColumns();
      fetchTotalRows();
      fetchFilteredRows();
      fetchLastUpdate();
      fetchTableData();
    } else {
      resetState();
    }
  }, [selectedDataset, filters]);

  const resetState = () => {
    setColumns([]);
    setFilters({});
    setTotalRows(0);
    setFilteredRows(0);
    setLastUpdate(null);
    setTableData([]);
    setTableColumns([]);
  };

  const fetchColumns = async () => {
    if (!selectedDataset) return;
    
    try {
      const { data, error } = await supabase
        .from(selectedDataset as TableNames)
        .select()
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const filteredColumns = Object.keys(data[0]).filter(col => !col.startsWith('md_'));
        setColumns(filteredColumns);
        
        // Create table columns configuration
        const tableColumns: ColumnDef<any>[] = filteredColumns.map(col => ({
          accessorKey: col,
          header: col,
          cell: info => info.getValue()?.toString() || '',
        }));
        setTableColumns(tableColumns);
      }
    } catch (error) {
      console.error('Error fetching columns:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dataset columns.",
      });
    }
  };

  const fetchLastUpdate = async () => {
    if (!selectedDataset) return;

    try {
      // First check if the table has any rows
      const { count } = await supabase
        .from(selectedDataset as TableNames)
        .select('*', { count: 'exact', head: true });

      if (!count) {
        setLastUpdate(null);
        return;
      }

      // Get the first row to check available columns
      const { data: sampleData, error: sampleError } = await supabase
        .from(selectedDataset as TableNames)
        .select('*')
        .limit(1);

      if (sampleError || !sampleData || !sampleData.length) {
        setLastUpdate(null);
        return;
      }

      // Check if md_last_update exists in the sample data
      if ('md_last_update' in sampleData[0]) {
        const { data, error } = await supabase
          .from(selectedDataset as TableNames)
          .select('md_last_update')
          .order('md_last_update', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data && 'md_last_update' in data) {
          setLastUpdate(data.md_last_update as string);
        } else {
          setLastUpdate(null);
        }
      } else {
        setLastUpdate(null);
      }
    } catch (error) {
      console.error('Error fetching last update:', error);
      setLastUpdate(null);
    }
  };

  const fetchTotalRows = async () => {
    if (!selectedDataset) return;

    try {
      const { count, error } = await supabase
        .from(selectedDataset as TableNames)
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalRows(count || 0);
    } catch (error) {
      console.error('Error fetching total rows:', error);
    }
  };

  const fetchFilteredRows = async () => {
    if (!selectedDataset) return;

    try {
      let query = supabase
        .from(selectedDataset as TableNames)
        .select('*', { count: 'exact', head: true });

      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          query = query.ilike(column, `%${value}%`);
        }
      });

      const { count, error } = await query;

      if (error) throw error;
      setFilteredRows(count || 0);
    } catch (error) {
      console.error('Error fetching filtered rows:', error);
    }
  };

  const fetchTableData = async () => {
    if (!selectedDataset) return;
    setLoading(true);

    try {
      let query = supabase
        .from(selectedDataset as TableNames)
        .select('*');

      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          query = query.ilike(column, `%${value}%`);
        }
      });

      const { data, error } = await query.range(0, 99);

      if (error) throw error;
      setTableData(data || []);
    } catch (error) {
      console.error('Error fetching table data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load table data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleExport = async () => {
    if (!selectedDataset || !user?.id) return;

    setLoading(true);
    try {
      let query = supabase.from(selectedDataset as TableNames).select();

      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          query = query.ilike(column, `%${value}%`);
        }
      });

      const { data, error } = await query.limit(1000);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "No Data",
          description: "No data found with the current filters.",
        });
        return;
      }

      await supabase
        .from('exports')
        .insert({
          user_id: user.id,
          export_name: selectedDataset,
          export_type: 'filtered_dataset'
        });

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDataset}_filtered.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Dataset exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting dataset:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export dataset.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Explore & Export</h2>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!selectedDataset || loading}
          className="bg-corporate-orange hover:bg-corporate-orange/90 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Selected Dataset</Label>
          <div className="h-10 px-4 py-2 border rounded-md bg-muted">
            {selectedDataset || 'No dataset selected'}
          </div>
          
          <DatasetStats
            totalRows={totalRows}
            columnsCount={columns.length}
            filteredRows={filteredRows}
            lastUpdate={lastUpdate}
          />
        </div>

        {selectedDataset && columns.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            
            <DatasetFilters
              columns={columns}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <div className="mt-6">
              <VirtualizedTable
                data={tableData}
                columns={tableColumns}
                isLoading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
