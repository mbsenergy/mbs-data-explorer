export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          dataset_name: string
          downloaded_at: string | null
          id: string
          is_custom_query: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dataset_name: string
          downloaded_at?: string | null
          id?: string
          is_custom_query?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dataset_name?: string
          downloaded_at?: string | null
          id?: string
          is_custom_query?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      exports: {
        Row: {
          id: string
          user_id: string
          export_name: string
          export_type: string
          downloaded_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          export_name: string
          export_type: string
          downloaded_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          export_name?: string
          export_type?: string
          downloaded_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      api_tokens: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          last_used_at: string | null
          name: string | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          name?: string | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          name?: string | null
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      developer_analytics: {
        Row: {
          created_at: string | null
          downloaded_at: string | null
          file_name: string
          file_section: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          downloaded_at?: string | null
          file_name: string
          file_section: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          downloaded_at?: string | null
          file_name?: string
          file_section?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          github_username: string | null
          id: string
          is_cerved: boolean | null
          it_skills: string[] | null
          last_name: string | null
          linkedin_url: string | null
          preferred_data: string[] | null
          role: string | null
          subscriptions: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          github_username?: string | null
          id: string
          is_cerved?: boolean | null
          it_skills?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          preferred_data?: string[] | null
          role?: string | null
          subscriptions?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          github_username?: string | null
          id?: string
          is_cerved?: boolean | null
          it_skills?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          preferred_data?: string[] | null
          role?: string | null
          subscriptions?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          format: string
          id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          format: string
          id?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          format?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      scripts: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          id: string
          language: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          id?: string
          language: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          id?: string
          language?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_logins: {
        Row: {
          id: string
          logged_in_at: string
          user_id: string
        }
        Insert: {
          id?: string
          logged_in_at?: string
          user_id: string
        }
        Update: {
          id?: string
          logged_in_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          tablename: string
        }[]
      }
      get_last_connection: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      get_login_count_this_year: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never