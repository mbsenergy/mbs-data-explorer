import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import type { ColumnDef } from "@tanstack/react-table";

interface DataGridProps {
  data: any[];
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  style?: React.CSSProperties;
}

export function DataGrid({ data, columns, isLoading, style }: DataGridProps) {
  const gridStyle = useMemo(() => ({ 
    height: '800px', 
    width: '100%', 
    overflow: 'auto',
    ...style 
  }), [style]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    pivot: true,
    enablePivot: true,
    enableRowGroup: true,
    enableValue: true,
    enablePivotMode: true,
    floatingFilter: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
    },
  }), []);

  const columnDefs = useMemo(() => {
    return columns.map((col): ColDef => ({
      field: String(col.header),
      headerName: String(col.header),
      minWidth: 150,
      width: 200,
    }));
  }, [columns]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Don't auto-size columns to allow horizontal scrolling
  }, []);

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
        pivotPanelShow="always"
        pivotMode={false}
        sideBar={{
          position: 'right',
          defaultToolPanel: 'columns',
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressPivotMode: false,
                suppressValues: false,
                suppressRowGroups: false,
                suppressPivots: false,
              }
            },
            {
              id: 'filters',
              labelDefault: 'Filters',
              labelKey: 'filters',
              iconKey: 'filter',
              toolPanel: 'agFiltersToolPanel',
            },
          ],
        }}
        enableCellTextSelection={true}
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