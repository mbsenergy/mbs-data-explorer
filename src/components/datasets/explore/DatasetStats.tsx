interface DatasetStatsProps {
  totalRows: number;
  columnsCount: number;
  filteredRows: number;
  lastUpdate: string | null;
}

export const DatasetStats = ({ totalRows, columnsCount, filteredRows, lastUpdate }: DatasetStatsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-md bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total Rows</p>
          <p className="text-lg font-semibold">{totalRows.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-md bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total Columns</p>
          <p className="text-lg font-semibold">{columnsCount}</p>
        </div>
        <div className="p-3 rounded-md bg-card border border-border">
          <p className="text-sm text-muted-foreground">Filtered Rows</p>
          <p className="text-lg font-semibold">{filteredRows.toLocaleString()}</p>
        </div>
      </div>
      {lastUpdate && (
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};