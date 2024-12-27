import { DataGrid as DxDataGrid } from 'devextreme-react/data-grid';
import type { ColumnDef } from "@tanstack/react-table";
import type { DataGridProps } from '@/types/dataset';
import 'devextreme/dist/css/dx.dark.css';

export function DataGrid({ data, columns, isLoading, style }: DataGridProps) {
  const gridStyle = { 
    height: '600px', 
    width: '100%', 
    ...style 
  };

  const dxColumns = columns.map((col) => ({
    dataField: (col as any).accessorKey || col.id as string,
    caption: String(col.header),
    minWidth: 150,
    width: 200,
  }));

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      <DxDataGrid
        dataSource={data}
        columns={dxColumns}
        showBorders={true}
        columnAutoWidth={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        filterRow={{ visible: true }}
        headerFilter={{ visible: true }}
        searchPanel={{ visible: false }} // Removed search panel
        paging={{ pageSize: 20 }}
        pager={{
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true
        }}
        className="metallic-card"
        height="100%"
        columnResizingMode="widget"
        loadPanel={{
          enabled: true,
          showIndicator: true,
          showPane: true,
          text: 'Loading...'
        }}
      />
    </div>
  );
}