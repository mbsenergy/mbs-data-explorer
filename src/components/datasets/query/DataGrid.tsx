import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import type { ColumnDef } from "@tanstack/react-table";
import type { DataGridProps } from '@/types/dataset';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function DataGrid({ data, columns, isLoading, style }: DataGridProps) {
  const { toast } = useToast();
  const gridStyle = useMemo(() => ({ 
    height: '600px', 
    width: '100%', 
    ...style 
  }), [style]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    enablePivot: true, // Enable pivot for all columns by default
    enableRowGroup: true, // Enable row grouping for all columns
    enableValue: true, // Enable value aggregation for all columns
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
    },
  }), []);

  const columnDefs = useMemo(() => {
    return columns.map((col): ColDef => ({
      field: (col as any).accessorKey || col.id as string,
      headerName: String(col.header),
      minWidth: 150,
      width: 200,
      // Add specific pivot settings for numeric columns
      ...(typeof data[0]?.[(col as any).accessorKey] === 'number' && {
        aggFunc: 'sum', // Default aggregation function for numeric columns
        allowedAggFuncs: ['sum', 'avg', 'min', 'max', 'count'],
      }),
    }));
  }, [columns, data]);

  const gridOptions = {
    pivotMode: false, // Start with pivot mode disabled
    sideBar: {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          minWidth: 225,
          maxWidth: 225,
          width: 225,
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
          minWidth: 180,
          maxWidth: 400,
          width: 250,
        },
      ],
      position: 'right' as const, // Explicitly type as 'left' | 'right'
      defaultToolPanel: 'columns',
    },
  };

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  const togglePivotMode = (params: any) => {
    const api = params.api;
    const isPivotMode = !api.isPivotMode();
    api.setPivotMode(isPivotMode);
    
    toast({
      title: isPivotMode ? "Pivot Mode Enabled" : "Pivot Mode Disabled",
      description: isPivotMode 
        ? "Drag columns to row groups or values to create pivot tables" 
        : "Returned to standard view",
    });
  };

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={(e) => {
            const gridApi = (document.querySelector('.ag-theme-alpine-dark') as any)?.gridApi;
            if (gridApi) {
              togglePivotMode({ api: gridApi });
            }
          }}
          className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
        >
          Toggle Pivot Mode
        </Button>
      </div>
      <div className="ag-theme-alpine-dark" style={gridStyle}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          suppressCellFocus={true}
          onGridReady={onGridReady}
          suppressColumnVirtualisation={false}
          suppressRowVirtualisation={false}
          pagination={true}
          paginationPageSize={20}
          suppressPaginationPanel={false}
          suppressScrollOnNewData={true}
          {...gridOptions}
        />
      </div>
    </div>
  );
}