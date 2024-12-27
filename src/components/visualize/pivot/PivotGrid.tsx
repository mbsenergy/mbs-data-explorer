import { useEffect, useRef } from 'react';
import 'devextreme/dist/css/dx.dark.css';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import $ from 'jquery';
import 'devextreme/integration/jquery';
import { Card } from '@/components/ui/card';

interface PivotGridProps {
  data: any[];
}

export const PivotGrid = ({ data }: PivotGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    const fields = Object.keys(data[0]).map(field => ({
      caption: field,
      dataField: field,
      dataType: typeof data[0][field] === 'number' ? 'number' : 'string',
      summaryType: typeof data[0][field] === 'number' ? 'sum' : 'count'
    }));

    const pivotGridDataSource = new PivotGridDataSource({
      store: data,
      fields: fields
    });

    $(containerRef.current).dxPivotGrid({
      allowSortingBySummary: true,
      allowSorting: true,
      allowFiltering: true,
      allowExpandAll: true,
      height: 600,
      showBorders: true,
      showColumnGrandTotals: true,
      showRowGrandTotals: true,
      showRowTotals: true,
      showColumnTotals: true,
      dataSource: pivotGridDataSource,
      fieldPanel: {
        showColumnFields: true,
        showDataFields: true,
        showFilterFields: true,
        showRowFields: true,
        allowFieldDragging: true,
        visible: true
      },
      export: {
        enabled: true
      },
      onCellPrepared: (e: any) => {
        if (e.area === "data") {
          e.cellElement.css({
            'background-color': 'transparent',
            'color': 'white',
            'border-color': '#0c1d3b'
          });
        }
      },
      onContentReady: function() {
        $('.dx-pivotgrid').addClass('metallic-card');
        $('.dx-pivotgrid-horizontal-headers, .dx-pivotgrid-vertical-headers').css({
          'background-color': 'transparent',
          'color': 'white',
          'border-color': '#0c1d3b'
        });
      }
    });

    return () => {
      $(containerRef.current).dxPivotGrid('dispose');
    };
  }, [data]);

  return (
    <Card className="p-6 metallic-card">
      <div ref={containerRef} />
    </Card>
  );
};