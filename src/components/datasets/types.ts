import type { Database } from "@/integrations/supabase/types";
import type { ColumnDef } from "@tanstack/react-table";

export type TableInfo = {
  tablename: string;
};

export type TableNames = keyof Database['public']['Tables'];

export interface ColumnDefWithAccessor extends ColumnDef<any> {
  accessorKey: string;
  header: string;
  cell?: (info: any) => React.ReactNode;
}