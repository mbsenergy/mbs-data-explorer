interface DatasetStatsProps {
  totalRows: number;
  columnsCount: number;
  filteredRows: number;
  lastUpdate: string | null;
}

export const DatasetStats = ({
  totalRows,
  columnsCount,
  filteredRows,
  lastUpdate
}: DatasetStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-white/[0.05]">
        <div className="text-sm text-muted-foreground">Total Rows</div>
        <div className="text-2xl font-semibold">{totalRows.toLocaleString()}</div>
      </div>
      <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-white/[0.05]">
        <div className="text-sm text-muted-foreground">Columns</div>
        <div className="text-2xl font-semibold">{columnsCount}</div>
      </div>
      <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-white/[0.05]">
        <div className="text-sm text-muted-foreground">Filtered Rows</div>
        <div className="text-2xl font-semibold">{filteredRows.toLocaleString()}</div>
      </div>
      <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-white/[0.05]">
        <div className="text-sm text-muted-foreground">Last Update</div>
        <div className="text-2xl font-semibold">
          {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : 'N/A'}
        </div>
      </div>
    </div>
  );
};