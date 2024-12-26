import { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import type { ColumnDef } from "@tanstack/react-table";
import type { DataGridProps } from '@/types/dataset';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function DataGrid({ data, columns, isLoading, style }: DataGridProps) {
  const { toast } = useToast();
  const gridApiRef = useRef<GridApi | null>(null);
  
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
    enablePivot: true,
    enableRowGroup: true,
    enableValue: true,
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
      ...(typeof data[0]?.[(col as any).accessorKey] === 'number' && {
        aggFunc: 'sum',
        allowedAggFuncs: ['sum', 'avg', 'min', 'max', 'count'],
      }),
    }));
  }, [columns, data]);

  const gridOptions = {
    pivotMode: false,
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
      position: 'right' as const,
      defaultToolPanel: 'columns',
    },
  };

  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const togglePivotMode = () => {
    if (gridApiRef.current) {
      const isPivotMode = !gridApiRef.current.isPivotMode();
      gridApiRef.current.setPivotMode(isPivotMode);
      
      toast({
        title: isPivotMode ? "Pivot Mode Enabled" : "Pivot Mode Disabled",
        description: isPivotMode 
          ? "Drag columns to row groups or values to create pivot tables" 
          : "Returned to standard view",
      });
    }
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
          onClick={togglePivotMode}
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