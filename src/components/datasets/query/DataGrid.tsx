import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import type { ColumnDef } from "@tanstack/react-table";
import type { DataGridProps } from '@/types/dataset';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';

export function DataGrid({ data, columns, isLoading, style }: DataGridProps) {
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
    }));
  }, [columns]);

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
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
      />
    </div>
  );
}