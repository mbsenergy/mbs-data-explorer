import { Card } from "@/components/ui/card";
import { Code } from "lucide-react";
import SqlEditor from "@/components/datasets/SqlEditor";

interface SqlQueryBoxProps {
  onExecute: (query: string) => void;
  defaultValue?: string;
}

export const SqlQueryBox = ({ onExecute, defaultValue }: SqlQueryBoxProps) => {
  return (
    <Card className="p-6 metallic-card">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">SQL Query</h2>
        </div>
        <p className="text-muted-foreground">
          Execute custom SQL queries on the available datasets
        </p>
        <SqlEditor onExecute={onExecute} defaultValue={defaultValue} />
      </div>
    </Card>
  );
};