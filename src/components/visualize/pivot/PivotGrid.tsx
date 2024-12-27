import { AgGridReact } from 'ag-grid-react';
import { useState, useMemo, useCallback } from 'react';
import type { ColumnDef } from "@tanstack/react-table";
import type { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface PivotGridProps {
  data: any[];
  columns: ColumnDef<any>[];
}

export const PivotGrid = ({ data, columns }: PivotGridProps) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const { toast } = useToast();

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    sortable: true,
    filter: true,
    resizable: true,
    enablePivot: true,
    enableRowGroup: true,
    enableValue: true,
    floatingFilter: true,
  }), []);

  // Convert ColumnDef to AG Grid ColDef
  const agColumns: ColDef[] = useMemo(() => 
    columns.map(col => ({
      field: String(col.id),
      headerName: String(col.header),
      // Auto-detect if column should be used as a value column based on data type
      enableValue: typeof data[0]?.[String(col.id)] === 'number',
      // Set default aggregation function for numeric columns
      aggFunc: typeof data[0]?.[String(col.id)] === 'number' ? 'sum' : undefined,
    })),
  [columns, data]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const handleExport = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `pivot_export_${new Date().toISOString()}.csv`
      });
      toast({
        title: "Success",
        description: "Pivot data exported successfully",
      });
    }
  }, [gridApi, toast]);

  const handleReset = useCallback(() => {
    if (gridApi) {
      gridApi.setFilterModel(null);
      gridApi.setPivotMode(true);
      gridApi.setSortModel(null);
      setQuickFilter('');
      toast({
        title: "Reset Complete",
        description: "Pivot grid settings have been reset",
      });
    }
  }, [gridApi, toast]);

  const handleQuickFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuickFilter(value);
    if (gridApi) {
      gridApi.setQuickFilter(value);
    }
  }, [gridApi]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Quick filter..."
            value={quickFilter}
            onChange={handleQuickFilter}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

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
                toolPanelParams: {
                  suppressRowGroups: false,
                  suppressValues: false,
                  suppressPivots: false,
                  suppressPivotMode: false,
                  suppressColumnFilter: false,
                  suppressColumnSelectAll: false,
                }
              },
            ],
          }}
          suppressAggFuncInHeader={true}
          enableRangeSelection={true}
          enableCharts={true}
          pivotPanelShow="always"
          statusBar={{
            statusPanels: [
              { statusPanel: 'agTotalRowCountComponent', align: 'left' },
              { statusPanel: 'agFilteredRowCountComponent' },
              { statusPanel: 'agSelectedRowCountComponent' },
              { statusPanel: 'agAggregationComponent' },
            ],
          }}
          suppressMenuHide={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          suppressColumnVirtualisation={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};