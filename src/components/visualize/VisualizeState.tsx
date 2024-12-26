import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';
import { generateChartOptions } from "@/utils/chart";
import type { VisualizeState, PlotConfig, Filter, DataPoint } from "@/types/visualize";
import type { ColumnDef } from "@tanstack/react-table";

export const useVisualizeState = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [state, setState] = useState<VisualizeState>({
    originalData: [],
    filteredData: [],
    columns: [],
    isLoading: false,
    selectedTable: "",
    showChart: false,
    plotData: {},
    searchTerm: "",
    selectedField: "all",
    selectedType: "all",
    showOnlyFavorites: false
  });

  const [plotConfig, setPlotConfig] = useState<PlotConfig>({
    xAxis: "",
    yAxis: "",
    chartType: "scatter",
    groupBy: "",
    aggregation: "none",
    xAxisType: "auto",
    yAxisType: "auto"
  });

  const [filters, setFilters] = useState<Filter[]>([
    { 
      id: uuidv4(), 
      searchTerm: "", 
      selectedColumn: "", 
      operator: "AND",
      comparisonOperator: "=" 
    }
  ]);

  useEffect(() => {
    if (state.showChart && plotConfig.xAxis && plotConfig.yAxis && state.filteredData.length) {
      console.log("Generating chart with data:", state.filteredData);
      console.log("Plot config:", plotConfig);
      const chartOptions = generateChartOptions(state.filteredData, plotConfig);
      setState(prev => ({ ...prev, plotData: chartOptions }));
    }
  }, [state.showChart]);

  const handleDataReceived = (data: DataPoint[], rawColumns: ColumnDef<any>[]) => {
    const typedColumns: ColumnDef<DataPoint>[] = rawColumns.map(col => ({
      id: String(col.id),
      header: col.header,
      accessorKey: String((col as any).accessorKey || col.id),
      cell: (info: any) => {
        const value = info.getValue();
        return value === null ? 'NULL' : String(value);
      }
    }));

    setState(prev => ({
      ...prev,
      originalData: data,
      filteredData: data,
      columns: typedColumns,
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim());
      const parsedData = rows.slice(1)
        .filter(row => row.trim())
        .map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header] = values[i]?.trim();
            return obj;
          }, {} as Record<string, string>);
        });

      const cols: ColumnDef<DataPoint>[] = headers.map(header => ({
        id: header,
        header,
        accessorKey: header,
      }));

      setState(prev => ({
        ...prev,
        originalData: parsedData,
        filteredData: parsedData,
        columns: cols,
      }));
      toast({
        title: "Success",
        description: `Loaded ${parsedData.length} rows of data`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load CSV file",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleExportData = () => {
    if (!state.filteredData.length) return;

    try {
      const headers = Object.keys(state.filteredData[0]).join(',');
      const rows = state.filteredData.map(row => 
        Object.values(row).map(value => {
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
      a.download = `data_export_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export data",
      });
    }
  };

  return {
    state,
    setState,
    plotConfig,
    setPlotConfig,
    filters,
    setFilters,
    handleDataReceived,
    handleFileUpload,
    handleExportData
  };
};
