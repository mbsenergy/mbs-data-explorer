import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatamartSearch } from "@/components/visualize/DatamartSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import type { TableInfo } from "@/components/datasets/types";
import { Label } from "@/components/ui/label";
import { Download, Database, BarChart } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';
import type { ColumnDef } from "@tanstack/react-table";
import { DatasetFilters } from "@/components/datasets/explore/DatasetFilters";
import type { Filter } from "@/components/datasets/explore/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DataDisplay } from "@/components/visualize/DataDisplay";

interface DataPoint {
  [key: string]: any;
}

const chartTypes = [
  { value: "scatter", label: "Scatter" },
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "box", label: "Box" }
];

const Visualize = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [originalData, setOriginalData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [plotConfig, setPlotConfig] = useState({
    xAxis: "",
    yAxis: "",
    chartType: "scatter",
    groupBy: "",
    aggregation: "none",
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
  const [showChart, setShowChart] = useState(false);
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
    const matchesSearch = table.tablename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "all" || table.tablename.startsWith(selectedField);
    const matchesType = selectedType === "all" || table.tablename.match(new RegExp(`^[A-Z]{2}${selectedType}_`));
    const matchesFavorite = !showOnlyFavorites || favorites.has(table.tablename);
    return matchesSearch && matchesField && matchesType && matchesFavorite;
  });

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    handleQueryData();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
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

      setOriginalData(parsedData);
      setFilteredData(parsedData);
      setColumns(cols);
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
      setIsLoading(false);
    }
  };

  const handleQueryData = async () => {
    if (!selectedTable) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a table",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: queryData, error } = await supabase
        .from(selectedTable)
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

        setOriginalData(queryData);
        setFilteredData(queryData);
        setColumns(cols);
        toast({
          title: "Success",
          description: `Loaded ${queryData.length} rows from ${selectedTable}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to query data",
      });
    } finally {
      setIsLoading(false);
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
    if (!filteredData.length) return;

    try {
      const headers = Object.keys(filteredData[0]).join(',');
      const rows = filteredData.map(row => 
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
        Visualize Data
      </h1>
      
      <DatamartSearch
        tables={tables || []}
        filteredTables={filteredTables || []}
        favorites={favorites}
        selectedDataset={selectedTable}
        onPreview={() => {}}
        onDownload={() => {}}
        onSelect={handleTableSelect}
        onToggleFavorite={toggleFavorite}
        onSearchChange={setSearchTerm}
        onFieldChange={setSelectedField}
        onTypeChange={setSelectedType}
        onFavoriteChange={setShowOnlyFavorites}
        availableFields={Array.from(new Set(tables?.map(t => t.tablename.slice(0, 2)) || []))}
        availableTypes={Array.from(new Set(tables?.map(t => t.tablename.slice(2, 4)) || []))}
      />

      {originalData.length > 0 && (
        <>
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
                  columns={columns.map(col => col.accessorKey as string)}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onAddFilter={handleAddFilter}
                  onRemoveFilter={handleRemoveFilter}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setFilteredData(applyFilters(originalData))} className="bg-[#4fd9e8] hover:bg-[#4fd9e8]/90 text-white">
                    Apply Filters
                  </Button>
                </div>
                <div className="border-t border-border mt-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-md bg-muted/50 border border-border">
                      <div className="text-sm text-muted-foreground">Original Data Rows</div>
                      <div className="text-2xl font-semibold">{originalData.length.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-md bg-muted/50 border border-border">
                      <div className="text-sm text-muted-foreground">Filtered Data Rows</div>
                      <div className="text-2xl font-semibold">{filteredData.length.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

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
                        {columns.map(col => (
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
                        {columns.map(col => (
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
                        {columns.map(col => (
                          <option key={col.accessorKey as string} value={col.accessorKey as string}>
                            {col.header as string}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-6 space-y-2">
                      <Label>Chart Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {chartTypes.map(({ value, label }) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroup
                              value={plotConfig.chartType}
                              onValueChange={(value) => setPlotConfig(prev => ({ ...prev, chartType: value }))}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={value} id={`chart-${value}`} />
                                <Label htmlFor={`chart-${value}`} className="flex items-center gap-2">
                                  {label}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                    </div>

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
                      onClick={() => setShowChart(true)}
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

          <DataDisplay
            showChart={showChart}
            plotData={plotData}
            plotConfig={plotConfig}
            filteredData={filteredData}
            columns={columns}
            isLoading={isLoading}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleExportData}
              disabled={!filteredData.length}
              className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-black border-[#F2C94C]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Visualize;
