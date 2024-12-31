export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ExpertiseMode = 'data' | 'energy';