import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Code } from "lucide-react";
import { DataControls } from "./DataControls";
import { VisualizeSqlQuery } from "./VisualizeSqlQuery";
import type { ColumnDef } from "@tanstack/react-table";

interface DataInputTabsProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDataReceived: (data: any[], columns: ColumnDef<any>[]) => void;
  isLoading: boolean;
  selectedTable: string;
}

export const DataInputTabs = ({
  onUpload,
  onDataReceived,
  isLoading,
  selectedTable,
}: DataInputTabsProps) => {
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList>
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Local File
        </TabsTrigger>
        <TabsTrigger value="query" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          SQL Query
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <DataControls
          onUpload={onUpload}
          onExecuteQuery={() => {}}
          isLoading={isLoading}
          selectedTable={selectedTable}
        />
      </TabsContent>
      <TabsContent value="query">
        <VisualizeSqlQuery onDataReceived={onDataReceived} />
      </TabsContent>
    </Tabs>
  );
};