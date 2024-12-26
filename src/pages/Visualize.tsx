import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatamartSearch } from "@/components/visualize/DatamartSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import type { TableInfo } from "@/components/datasets/types";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Database,
  Table,
  ChartBar,
  BarChart, 
  Download, 
  ChevronUp, 
  ChevronDown,
  LineChart,
  ScatterChart,
  BoxSelect
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DataGrid } from "@/components/datasets/query/DataGrid";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';
import type { ColumnDef } from "@tanstack/react-table";
import { DatasetFilters } from "@/components/datasets/explore/DatasetFilters";
import type { Filter } from "@/components/datasets/explore/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SqlQueryBox } from "@/components/datasets/SqlQueryBox";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "@/integrations/highcharts/highchartsConfig";
import { DataPoint, PlotConfig, VisualizeState } from "@/types/visualize";
import { generateChartOptions } from "@/utils/chart";

const chartTypes = [
  { value: "scatter", label: "Scatter", icon: ScatterChart },
  { value: "bar", label: "Bar", icon: BarChart },
  { value: "line", label: "Line", icon: LineChart },
  { value: "box", label: "Box", icon: BoxSelect }
] as const;

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
    plotData: [],
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

  const [isUploadOpen, setIsUploadOpen] = useState(true);
  const [isQueryOpen, setIsQueryOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isChartOpen, setIsChartOpen] = useState(true);

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

  const handleTableSelect = (tableName: string) => {
    setState(prev => ({ ...prev, selectedTable: tableName }));
    handleQueryData();
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

      const cols: ColumnDef<any>[] = headers.map(header => ({
        accessorKey: header,
        header,
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
        .from(state.selectedTable)
        .select('*')
        .limit(1000);

      if (error) throw error;

      if (queryData && queryData.length > 0) {
        const cols: ColumnDef<any>[] = Object.keys(queryData[0])
          .filter(key => !key.startsWith('md_'))
          .map(key => ({
            accessorKey: key,
            header: key,
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

  const handleFilterChange = (
    filterId: string,
    field: keyof Filter,
    value: string
  ) => {
    setFilters(filters.map(f =>
      f.id === filterId
        ? { ...f, [field]: value }
        : f
    ));
  };

  const handleAddFilter = () => {
    setFilters([...filters, { 
      id: uuidv4(), 
      searchTerm: "", 
      selectedColumn: "", 
      operator: "AND",
      comparisonOperator: "=" 
    }]);
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload CSV Card */}
        <Card className="p-6 metallic-card relative">
          <Collapsible open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Upload CSV</h2>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isUploadOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={state.isLoading}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>

          {/* SQL Query Box */}
          <SqlQueryBox 
            onExecute={handleExportData} 
            defaultValue={`SELECT * FROM "${state.selectedTable || 'your_table'}" LIMIT 100`} 
            />
        
      </div>

          {/* Filters Card */}
          <Card className="p-6 metallic-card relative">
            <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <DatasetFilters
                  columns={state.columns.map(col => col.accessorKey as string)}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onAddFilter={handleAddFilter}
                  onRemoveFilter={handleRemoveFilter}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setState(prev => ({ ...prev, filteredData: applyFilters(state.originalData) }))} className="bg-[#4fd9e8] hover:bg-[#4fd9e8]/90 text-white">
                    Apply Filters
                  </Button>
                </div>
                <div className="mt-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-md border border-border">
                      <div className="text-sm text-muted-foreground">Original Data Rows</div>
                      <div className="text-2xl font-semibold">{state.originalData.length.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-md border border-border">
                      <div className="text-sm text-muted-foreground">Filtered Data Rows</div>
                      <div className="text-2xl font-semibold">{state.filteredData.length.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Chart Configuration Card */}
          <Card className="p-6 metallic-card relative">
            <Collapsible open={isChartOpen} onOpenChange={setIsChartOpen}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Chart Configuration
                </h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isChartOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>X Axis</Label>
                      <select 
                        className="w-full rounded-md border bg-background px-3 py-2"
                        value={plotConfig.xAxis}
                        onChange={(e) => setPlotConfig(prev => ({ ...prev, xAxis: e.target.value }))}
                      >
                        <option value="">Select column</option>
                        {state.columns.map(col => (
                          <option key={col.accessorKey as string} value={col.accessorKey as string}>
                            {col.header as string}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Y Axis</Label>
                      <select
                        className="w-full rounded-md border bg-background px-3 py-2"
                        value={plotConfig.yAxis}
                        onChange={(e) => setPlotConfig(prev => ({ ...prev, yAxis: e.target.value }))}
                      >
                        <option value="">Select column</option>
                        {state.columns.map(col => (
                          <option key={col.accessorKey as string} value={col.accessorKey as string}>
                            {col.header as string}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Group By</Label>
                      <select
                        className="w-full rounded-md border bg-background px-3 py-2"
                        value={plotConfig.groupBy}
                        onChange={(e) => setPlotConfig(prev => ({ ...prev, groupBy: e.target.value }))}
                      >
                        <option value="">No grouping</option>
                        {state.columns.map(col => (
                          <option key={col.accessorKey as string} value={col.accessorKey as string}>
                            {col.header as string}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    {/* Chart Type Selection - 6 columns */}
                    <div className="col-span-6 space-y-2">
                      <Label>Chart Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {chartTypes.map(({ value, label, icon: Icon }) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroup
                              value={plotConfig.chartType}
                              onValueChange={(value) => setPlotConfig(prev => ({ ...prev, chartType: value }))}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={value} id={`chart-${value}`} />
                                <Label htmlFor={`chart-${value}`} className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {label}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summarizing Function - 6 columns */}
                    <div className="col-span-6 space-y-2">
                      <Label>Summarizing Function</Label>
                      <RadioGroup
                        value={plotConfig.aggregation || 'none'}
                        onValueChange={(value) => setPlotConfig(prev => ({ ...prev, aggregation: value }))}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="agg-none" />
                            <Label htmlFor="agg-none">None</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sum" id="agg-sum" />
                            <Label htmlFor="agg-sum">Sum</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mean" id="agg-mean" />
                            <Label htmlFor="agg-mean">Mean</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="max" id="agg-max" />
                            <Label htmlFor="agg-max">Max</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="min" id="agg-min" />
                            <Label htmlFor="agg-min">Min</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => setState(prev => ({ ...prev, showChart: true }))}
                      disabled={!plotConfig.xAxis || !plotConfig.yAxis}
                      className="bg-[#4fd9e8] hover:bg-[#4fd9e8]/90 text-white"
                    >
                      Generate Chart
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleExportData}
              disabled={!state.filteredData.length}
              className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>          

          <Card className="p-6 metallic-card relative">
            <Collapsible open={isUploadOpen} onOpenChange={setIsUploadOpen}>

            <Tabs defaultValue="plot" className="space-y-6">
              <TabsList>
                <TabsTrigger value="plot" className="flex items-center gap-2">
                  <ChartBar className="h-4 w-4" />
                  Plot
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Table
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plot">
                <div className="w-full h-[600px]">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={state.plotData}
                    containerProps={{ style: { height: '100%' } }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="table">
                <DataGrid
                  data={state.filteredData}
                  columns={state.columns}
                  isLoading={state.isLoading}
                />
              </TabsContent>
            </Tabs>
            </Collapsible>
          </Card>
    </div>
  );
};

export default Visualize;
