import type { Database } from "@/integrations/supabase/types";

export type TableInfo = {
  tablename: string;
};

export type TableNames = keyof Database['public']['Tables'];