export type ComparisonOperator = '=' | '>' | '<' | '>=' | '<=' | '!=' | 'IN' | 'NOT IN';

export interface Filter {
  id: string;
  searchTerm: string;
  selectedColumn: string;
  operator: 'AND' | 'OR';
  comparisonOperator: ComparisonOperator;
}