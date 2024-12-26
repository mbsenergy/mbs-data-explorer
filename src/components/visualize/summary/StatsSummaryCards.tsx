import { Card } from "@/components/ui/card";
import { Gem, Diamond, Trophy } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface StatsSummaryCardsProps {
  data: any[];
  columns: ColumnDef<any>[];
}

export const StatsSummaryCards = ({ data, columns }: StatsSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4 metallic-card">
        <div className="flex items-center gap-2">
          <Gem className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Total Rows</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">
          {data.length.toLocaleString()}
        </p>
      </Card>
      <Card className="p-4 metallic-card">
        <div className="flex items-center gap-2">
          <Diamond className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Total Columns</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">
          {columns.length.toLocaleString()}
        </p>
      </Card>
      <Card className="p-4 metallic-card">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Data Points</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">
          {(data.length * columns.length).toLocaleString()}
        </p>
      </Card>
    </div>
  );
};