import { useEffect, useRef } from 'react';
import WebDataRocks from 'webdatarocks';
import type { ColumnDef } from "@tanstack/react-table";
import type { DataGridProps } from '@/types/dataset';
import { useToast } from '@/hooks/use-toast';
import 'webdatarocks/webdatarocks.min.css';

export function DataGrid({ data, columns, isLoading, style }: DataGridProps) {
  const pivotRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const pivotInstance = useRef<any>(null);
  
  useEffect(() => {
    if (!isLoading && data && data.length > 0 && pivotRef.current) {
      try {
        // Clean up previous instance if it exists
        if (pivotInstance.current) {
          pivotInstance.current.dispose();
        }

        // Create field configurations from columns
        const fields = columns.map((col: ColumnDef<any>) => ({
          name: (col as any).accessorKey || col.id as string,
          caption: String(col.header),
          type: 'string'
        }));

        // Initialize WebDataRocks with theme matching
        pivotInstance.current = new WebDataRocks({
          container: pivotRef.current,
          toolbar: false,
          height: 600,
          width: '100%',
          report: {
            dataSource: {
              data: data
            },
            formats: [{
              name: "customFormat",
              thousandsSeparator: ",",
              decimalSeparator: ".",
              decimalPlaces: 2,
              currencySymbol: "",
              currencySymbolAlign: "left",
              nullValue: "",
              textAlign: "right",
              isPercent: false
            }],
            options: {
              grid: {
                type: "flat",
                showTotals: "off",
                showGrandTotals: "off",
                showHeaders: false,
              },
              configuratorButton: false,
              showAggregations: false,
              showCalculatedValuesButton: false,
              showDrillThroughConfigurator: false,
              sorting: false,
              showFilter: false,
              showHeaders: false,
              showMeasures: false,
              showReportFiltersArea: false,
            }
          },
          global: {
            localization: "off"
          },
          customizeCell: function(cell: any) {
            // Apply theme colors
            if (cell.isClassicView) {
              cell.style = {
                "background": "hsl(var(--background))",
                "color": "hsl(var(--foreground))",
                "border-color": "hsl(var(--border))",
                "font-family": "var(--font-sans)",
                "font-size": "13px",
                "padding": "8px 12px"
              };
            }
          }
        });

      } catch (error) {
        console.error('Error initializing WebDataRocks:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize pivot table"
        });
      }
    }

    // Cleanup function
    return () => {
      if (pivotInstance.current) {
        pivotInstance.current.dispose();
      }
    };
  }, [data, columns, isLoading]);

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <div ref={pivotRef} style={{ ...style }} />
    </div>
  );
}