import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DatasetStatsProps {
  totalRows: number;
  columnsCount: number;
  filteredRows: number;
  lastUpdate: string | null;
  loadingProgress?: number;
}

export const DatasetStats = ({
  totalRows,
  columnsCount,
  filteredRows,
  lastUpdate,
  loadingProgress
}: DatasetStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium">Total Rows</h3>
        <p className="mt-2 text-2xl font-bold">{totalRows.toLocaleString()}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium">Columns</h3>
        <p className="mt-2 text-2xl font-bold">{columnsCount}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium">Filtered Rows</h3>
        <p className="mt-2 text-2xl font-bold">{filteredRows.toLocaleString()}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium">Last Update</h3>
        <p className="mt-2 text-lg font-medium">
          {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : 'N/A'}
        </p>
      </Card>
      {loadingProgress > 0 && loadingProgress < 100 && (
        <Card className="p-4 md:col-span-4">
          <h3 className="text-sm font-medium mb-2">Loading Progress</h3>
          <Progress value={loadingProgress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-1">
            {loadingProgress}% complete
          </p>
        </Card>
      )}
    </div>
  );
};