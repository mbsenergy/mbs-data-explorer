interface DatasetStatsProps {
  totalRows: number;
  columnsCount: number;
  filteredRows: number;
  lastUpdate: string | null;
}

export const DatasetStats = ({ totalRows, columnsCount, filteredRows, lastUpdate }: DatasetStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-2">
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
      {lastUpdate && (
        <div className="col-span-3 text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};