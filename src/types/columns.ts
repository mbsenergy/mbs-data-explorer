export type ColumnDataType = 'text' | 'number' | 'date' | 'boolean';

export interface ColumnTypeConfig {
  name: string;
  type: ColumnDataType;
}