import type { Database } from "@/integrations/supabase/types";

export type TableInfo = {
  tablename: string;
};

export type TableNames = keyof Database['public']['Tables'];

export interface ColumnDefWithAccessor {
  accessorKey: string;
  header: string;
  cell?: (info: any) => React.ReactNode;
}