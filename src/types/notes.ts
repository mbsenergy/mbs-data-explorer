export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}