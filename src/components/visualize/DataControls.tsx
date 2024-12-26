import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Database } from "lucide-react";
import { DataControlsProps } from "@/types/visualize";
import { SqlQueryBox } from "@/components/datasets/SqlQueryBox";

export const DataControls = ({ onUpload, onExecuteQuery, isLoading, selectedTable }: DataControlsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 metallic-card">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Upload CSV</h2>
        </div>
        <Input
          type="file"
          accept=".csv"
          onChange={onUpload}
          disabled={isLoading}
        />
      </Card>

      <SqlQueryBox 
        onExecute={onExecuteQuery} 
        defaultValue={`SELECT * FROM "${selectedTable || 'your_table'}" LIMIT 100`} 
      />
    </div>
  );
};