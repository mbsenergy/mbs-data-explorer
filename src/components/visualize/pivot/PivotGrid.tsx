import { useEffect, useRef } from 'react';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { PivotGrid as DxPivotGrid } from 'devextreme-react/pivot-grid';
import { Card } from '@/components/ui/card';
import type { PivotGridDataSourceField } from 'devextreme/ui/pivot_grid/data_source';
import 'devextreme/dist/css/dx.dark.css';

interface PivotGridProps {
  data: any[];
}

export const PivotGrid = ({ data }: PivotGridProps) => {
  if (!data.length) {
    return null;
  }

  const fields: PivotGridDataSourceField[] = Object.keys(data[0]).map(field => ({
    caption: field,
    dataField: field,
    dataType: typeof data[0][field] === 'number' ? 'number' : 'string',
    summaryType: typeof data[0][field] === 'number' ? 'sum' : 'count'
  }));

  const dataSource = new PivotGridDataSource({
    store: data,
    fields: fields
  });

  return (
    <Card className="p-6 metallic-card">
      <DxPivotGrid
        id="pivotgrid"
        dataSource={dataSource}
        allowSortingBySummary={true}
        allowSorting={true}
        allowFiltering={true}
        allowExpandAll={true}
        height={600}
        showBorders={true}
        showColumnGrandTotals={true}
        showRowGrandTotals={true}
        showRowTotals={true}
        showColumnTotals={true}
        className="bg-transparent"
      />
    </Card>
  );
};