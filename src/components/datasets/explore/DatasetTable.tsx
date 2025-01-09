import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';

interface DatasetTableProps {
  columns: string[];
  data: any[];
  selectedColumns: string[];
}

export const DatasetTable = ({ columns, data, selectedColumns }: DatasetTableProps) => {
  const tableColumns = useMemo(() => {
    return selectedColumns.map((col): ColDef => ({
      field: col,
      headerName: col,
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 150,
    }));
  }, [selectedColumns]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1,
  }), []);

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  console.log("Data being passed to AG Grid:", data);
  console.log("Columns configuration:", tableColumns);

  return (
    <div className="ag-theme-alpine-dark h-[600px] w-full">
      <AgGridReact
        rowData={data}
        columnDefs={tableColumns}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        pagination={true}
        paginationPageSize={20}
        suppressPaginationPanel={false}
        animateRows={true}
        enableCellTextSelection={true}
        ensureDomOrder={true}
        suppressColumnVirtualisation={false}
        suppressRowVirtualisation={false}
      />
    </div>
  );
};