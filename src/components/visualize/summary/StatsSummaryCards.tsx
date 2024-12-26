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
      <Card className="p-4 bg-gradient-to-br from-cyan-900 to-slate-900 border-cyan-700">
        <div className="flex items-center gap-2">
          <Gem className="h-5 w-5 text-cyan-400" />
          <h3 className="font-medium text-cyan-100">Total Rows</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          {data.length.toLocaleString()}
        </p>
      </Card>
      <Card className="p-4 bg-gradient-to-br from-purple-900 to-slate-900 border-purple-700">
        <div className="flex items-center gap-2">
          <Diamond className="h-5 w-5 text-purple-400" />
          <h3 className="font-medium text-purple-100">Total Columns</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
          {columns.length.toLocaleString()}
        </p>
      </Card>
      <Card className="p-4 bg-gradient-to-br from-amber-900 to-slate-900 border-amber-700">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h3 className="font-medium text-amber-100">Data Points</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          {(data.length * columns.length).toLocaleString()}
        </p>
      </Card>
    </div>
  );
};