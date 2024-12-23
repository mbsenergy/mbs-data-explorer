import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
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
  const { toast } = useToast();
  const { user } = useAuth();

  React.useEffect(() => {
    if (selectedDataset) {
      fetchColumns();
      fetchTotalRows();
      fetchFilteredRows();
      fetchLastUpdate();
    } else {
      setColumns([]);
      setFilters({});
      setTotalRows(0);
      setFilteredRows(0);
      setLastUpdate(null);
    }
  }, [selectedDataset, filters]);

  const fetchColumns = async () => {
    if (!selectedDataset) return;
    
    try {
      const { data, error } = await supabase
        .from(selectedDataset as TableNames)
        .select()
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        // Filter out metadata columns
        const filteredColumns = Object.keys(data[0]).filter(col => !col.startsWith('md_'));
        setColumns(filteredColumns);
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
      const { data, error } = await supabase
        .from(selectedDataset as TableNames)
        .select('md_last_update')
        .order('md_last_update', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setLastUpdate(data[0].md_last_update);
      }
    } catch (error) {
      console.error('Error fetching last update:', error);
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
          
          {lastUpdate && (
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(lastUpdate).toLocaleDateString()}
            </div>
          )}
          
          {selectedDataset && (
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="p-3 glass-panel rounded-md">
                <p className="text-sm text-muted-foreground">Total Rows</p>
                <p className="text-lg font-semibold">{totalRows.toLocaleString()}</p>
              </div>
              <div className="p-3 glass-panel rounded-md">
                <p className="text-sm text-muted-foreground">Total Columns</p>
                <p className="text-lg font-semibold">{columns.length}</p>
              </div>
              <div className="p-3 glass-panel rounded-md">
                <p className="text-sm text-muted-foreground">Filtered Rows</p>
                <p className="text-lg font-semibold">{filteredRows.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {selectedDataset && columns.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map(column => (
                <div key={column}>
                  <Label>{column}</Label>
                  <Input
                    placeholder={`Filter by ${column}`}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    value={filters[column] || ''}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};