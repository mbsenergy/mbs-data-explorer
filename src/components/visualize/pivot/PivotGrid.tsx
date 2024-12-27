import { AgGridReact } from 'ag-grid-react';
import { useState, useMemo } from 'react';
import type { ColumnDef } from "@tanstack/react-table";
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface PivotGridProps {
  data: any[];
  columns: ColumnDef<any>[];
}

export const PivotGrid = ({ data, columns }: PivotGridProps) => {
  const [gridApi, setGridApi] = useState<any>(null);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  // Convert ColumnDef to AG Grid ColDef
  const agColumns: ColDef[] = useMemo(() => 
    columns.map(col => ({
      field: String(col.id),
      headerName: String(col.header),
      enablePivot: true,
      enableRowGroup: true,
      enableValue: typeof data[0]?.[String(col.id)] === 'number',
    })),
  [columns, data]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="ag-theme-alpine-dark h-[600px] w-full">
      <AgGridReact
        rowData={data}
        columnDefs={agColumns}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        pivotMode={true}
        sideBar={{
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
            },
          ],
        }}
        suppressAggFuncInHeader={true}
        enableRangeSelection={true}
        pivotPanelShow={'always'}
        statusBar={{
          statusPanels: [
            { statusPanel: 'agTotalRowCountComponent', align: 'left' },
            { statusPanel: 'agFilteredRowCountComponent' },
          ],
        }}
      />
    </div>
  );
};