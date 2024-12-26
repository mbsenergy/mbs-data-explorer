import { useState } from "react";
import { DataInputTabs } from "@/components/visualize/DataInputTabs";
import { CollapsibleCard } from "@/components/visualize/CollapsibleCard";
import { ChartControls } from "@/components/visualize/ChartControls";
import { FilterControls } from "@/components/visualize/FilterControls";
import { DataColumnSelect } from "@/components/visualize/DataColumnSelect";
import { DataColumnTypeSelect } from "@/components/visualize/DataColumnTypeSelect";
import { DataDisplay } from "@/components/visualize/DataDisplay";
import { useVisualizeState } from "@/components/visualize/VisualizeState";
import { convertDataset } from "@/utils/dataTypeConversion";
import { v4 as uuidv4 } from 'uuid';
import type { DataPoint } from "@/types/visualize";
import type { ColumnDef } from "@tanstack/react-table";
import type { ColumnTypeConfig, ColumnDataType } from "@/types/columns";

const Visualize = () => {
  const {
    state,
    setState,
    plotConfig,
    filters,
    setFilters,
    setPlotConfig,
    handleFileUpload,
    handleExportData
  } = useVisualizeState();

  const [columnTypes, setColumnTypes] = useState<ColumnTypeConfig[]>([]);

  const handleDataReceived = (data: DataPoint[], rawColumns: ColumnDef<any>[]) => {
    const initialColumnTypes = rawColumns.map(col => ({
      name: String(col.id),
      type: 'text' as ColumnDataType
    }));

    setColumnTypes(initialColumnTypes);

    const typedColumns: ColumnDef<DataPoint>[] = rawColumns.map(col => ({
      id: String(col.id),
      accessorKey: String(col.id),
      header: String(col.header),
      show: true,
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

  const handleColumnTypeChange = (columnName: string, type: ColumnDataType) => {
    // Update column types
    const newColumnTypes = columnTypes.map(col => 
      col.name === columnName ? { ...col, type } : col
    );
    setColumnTypes(newColumnTypes);

    // Convert data with new types
    const convertedData = convertDataset(state.originalData, newColumnTypes);
    
    setState(prev => ({
      ...prev,
      originalData: convertedData,
      filteredData: convertedData,
      showChart: false // Reset chart when types change
    }));
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

  const handleColumnSelect = (column: string) => {
    const newColumns = state.columns.map(col => {
      if (String(col.id) === column) {
        return {
          ...col,
          show: !col.show
        };
      }
      return col;
    });

    setState(prev => ({
      ...prev,
      columns: newColumns
    }));
  };

  const handleGenerateChart = () => {
    // First reset the chart state
    setState(prev => ({ ...prev, showChart: false }));
    
    // Then trigger a new chart generation in the next render cycle
    setTimeout(() => {
      setState(prev => ({ ...prev, showChart: true }));
    }, 0);
  };

  const handleApplyFilters = () => {
    const newFilteredData = applyFilters(state.originalData);
    console.log("Applying filters, new filtered data:", newFilteredData);
    setState(prev => ({ 
      ...prev, 
      filteredData: newFilteredData,
      showChart: false // Reset chart when filters change
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
        Visualize Data
      </h1>

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
          onApplyFilters={handleApplyFilters}
          originalCount={state.originalData.length}
          filteredCount={state.filteredData.length}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Columns">
        <div className="space-y-6">
          <DataColumnSelect
            columns={state.columns}
            selectedColumns={state.columns.filter(col => col.show).map(col => String(col.id))}
            onColumnSelect={handleColumnSelect}
          />
          
          <DataColumnTypeSelect
            columns={columnTypes}
            onTypeChange={handleColumnTypeChange}
          />
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Chart Configuration">
        <ChartControls
          columns={state.columns}
          plotConfig={plotConfig}
          onConfigChange={setPlotConfig}
          onGenerateChart={handleGenerateChart}
        />
      </CollapsibleCard>

      <DataDisplay
        plotData={state.plotData}
        filteredData={state.filteredData}
        columns={state.columns.filter(col => col.show)}
        isLoading={state.isLoading}
        onExport={handleExportData}
      />
    </div>
  );
};

export default Visualize;
