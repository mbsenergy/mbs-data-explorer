import { useState, useEffect } from "react";
import { DatamartSearch } from "@/components/visualize/DatamartSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';
import "@/integrations/highcharts/highchartsConfig";
import { ChartControls } from "@/components/visualize/ChartControls";
import { FilterControls } from "@/components/visualize/FilterControls";
import { generateChartOptions } from "@/utils/chart";
import { DataInputTabs } from "@/components/visualize/DataInputTabs";
import { CollapsibleCard } from "@/components/visualize/CollapsibleCard";
import { DataDisplay } from "@/components/visualize/DataDisplay";
import type { VisualizeState, PlotConfig, Filter, DataPoint } from "@/types/visualize";
import type { TableInfo } from "@/components/datasets/types";
import type { ColumnDef } from "@tanstack/react-table";

const Visualize = () => {
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
    aggregation: "none"
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

  const { favorites, toggleFavorite } = useFavorites();

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      return data as TableInfo[];
    },
  });

  const filteredTables = tables?.filter(table => {
    const matchesSearch = table.tablename.toLowerCase().includes(state.searchTerm.toLowerCase());
    const matchesField = state.selectedField === "all" || table.tablename.startsWith(state.selectedField);
    const matchesType = state.selectedType === "all" || table.tablename.match(new RegExp(`^[A-Z]{2}${state.selectedType}_`));
    const matchesFavorite = !state.showOnlyFavorites || favorites.has(table.tablename);
    return matchesSearch && matchesField && matchesType && matchesFavorite;
  });

  const handleTableSelect = async (tableName: string) => {
    setState(prev => ({ ...prev, selectedTable: tableName }));
    await handleQueryData();
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

  const handleQueryData = async () => {
    if (!state.selectedTable) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a table",
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data: queryData, error } = await supabase
        .from(state.selectedTable as TableNames)
        .select('*')
        .limit(1000);

      if (error) throw error;

      if (queryData && queryData.length > 0) {
        const cols: ColumnDef<DataPoint>[] = Object.keys(queryData[0])
          .filter(key => !key.startsWith('md_'))
          .map(key => ({
            id: key,
            header: key,
            accessorKey: key,
          }));

        setState(prev => ({
          ...prev,
          originalData: queryData,
          filteredData: queryData,
          columns: cols,
        }));
        toast({
          title: "Success",
          description: `Loaded ${queryData.length} rows from ${state.selectedTable}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to query data",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const compareValues = (itemValue: any, filterValue: string, operator: string): boolean => {
    const normalizedItemValue = String(itemValue).toLowerCase();
    const normalizedFilterValue = filterValue.toLowerCase();

    switch (operator) {
      case '=':
        return normalizedItemValue === normalizedFilterValue;
      case '>':
        return Number(itemValue) > Number(filterValue);
      case '<':
        return Number(itemValue) < Number(filterValue);
      case '>=':
        return Number(itemValue) >= Number(filterValue);
      case '<=':
        return Number(itemValue) <= Number(filterValue);
      case '!=':
        return normalizedItemValue !== normalizedFilterValue;
      case 'IN':
        const inValues = filterValue.split(',').map(v => v.trim().toLowerCase());
        return inValues.includes(normalizedItemValue);
      case 'NOT IN':
        const notInValues = filterValue.split(',').map(v => v.trim().toLowerCase());
        return !notInValues.includes(normalizedItemValue);
      default:
        return normalizedItemValue.includes(normalizedFilterValue);
    }
  };

  const applyFilters = (dataToFilter: DataPoint[]) => {
    return dataToFilter.filter((item) =>
      filters.reduce((pass, filter, index) => {
        if (!filter.searchTerm || !filter.selectedColumn) {
          return index === 0 ? true : pass;
        }

        const itemValue = item[filter.selectedColumn];
        const matches = compareValues(itemValue, filter.searchTerm, filter.comparisonOperator);

        if (index === 0) return matches;
        return filter.operator === 'AND' ? pass && matches : pass || matches;
      }, false)
    );
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

  useEffect(() => {
    if (!state.showChart || !plotConfig.xAxis || !plotConfig.yAxis || !state.filteredData.length) return;

    const chartOptions = generateChartOptions(state.filteredData, plotConfig);
    setState(prev => ({ ...prev, plotData: chartOptions }));
  }, [state.showChart, plotConfig, state.filteredData]);

  const handleDataReceived = (data: DataPoint[], rawColumns: ColumnDef<any>[]) => {
    // Transform the columns to ensure they match DataPoint type
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
        Visualize Data
      </h1>
      
      <DatamartSearch
        tables={tables || []}
        filteredTables={filteredTables || []}
        favorites={favorites}
        selectedDataset={state.selectedTable}
        onPreview={() => {}}
        onDownload={() => {}}
        onSelect={handleTableSelect}
        onToggleFavorite={toggleFavorite}
        onSearchChange={(term) => setState(prev => ({ ...prev, searchTerm: term }))}
        onFieldChange={(field) => setState(prev => ({ ...prev, selectedField: field }))}
        onTypeChange={(type) => setState(prev => ({ ...prev, selectedType: type }))}
        onFavoriteChange={(show) => setState(prev => ({ ...prev, showOnlyFavorites: show }))}
        availableFields={Array.from(new Set(tables?.map(t => t.tablename.slice(0, 2)) || []))}
        availableTypes={Array.from(new Set(tables?.map(t => t.tablename.slice(2, 4)) || []))}
      />

      <DataInputTabs
        onUpload={handleFileUpload}
        onDataReceived={handleDataReceived}
        isLoading={state.isLoading}
        selectedTable={state.selectedTable}
      />

      <CollapsibleCard title="Filters">
        <FilterControls
          columns={state.columns.map(col => col.id as string)}
          filters={filters}
          onFilterChange={(filterId, field, value) => {
            setFilters(filters.map(f =>
              f.id === filterId
                ? { ...f, [field]: value }
                : f
            ));
          }}
          onAddFilter={() => {
            setFilters([...filters, { 
              id: uuidv4(), 
              searchTerm: "", 
              selectedColumn: "", 
              operator: "AND",
              comparisonOperator: "=" 
            }]);
          }}
          onRemoveFilter={(filterId) => {
            setFilters(filters.filter(f => f.id !== filterId));
          }}
          onApplyFilters={() => {
            setState(prev => ({ 
              ...prev, 
              filteredData: applyFilters(state.originalData) 
            }));
          }}
          originalCount={state.originalData.length}
          filteredCount={state.filteredData.length}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Chart Configuration">
        <ChartControls
          columns={state.columns}
          plotConfig={plotConfig}
          onConfigChange={setPlotConfig}
          onGenerateChart={() => setState(prev => ({ ...prev, showChart: true }))}
        />
      </CollapsibleCard>

      <DataDisplay
        plotData={state.plotData}
        filteredData={state.filteredData}
        columns={state.columns}
        isLoading={state.isLoading}
        onExport={handleExportData}
      />
    </div>
  );
};

export default Visualize;
