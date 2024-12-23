import type { Database } from "@/integrations/supabase/types";

export type TableNames = keyof Database['public']['Tables'];