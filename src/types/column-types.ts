export type ColumnDataType = 'text' | 'number' | 'date' | 'boolean';

export interface ColumnTypeConfig {
  name: string;
  type: ColumnDataType;
  show: boolean;
}

export interface DataTypeOption {
  value: ColumnDataType;
  label: string;
  description: string;
}