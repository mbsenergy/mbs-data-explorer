import type { Database } from "@/integrations/supabase/types";

export type TableNames = keyof Database['public']['Tables'];

export interface TableInfo {
  tablename: string;
}