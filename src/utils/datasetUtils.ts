import type { ComparisonOperator } from "@/components/datasets/explore/types";

export const compareValues = (itemValue: any, filterValue: string, operator: ComparisonOperator): boolean => {
  const normalizedItemValue = String(itemValue).toLowerCase();
  const normalizedFilterValue = filterValue.toLowerCase();

  switch (operator) {
    case '=':
      return normalizedItemValue === normalizedFilterValue;
    case '>':
      return Number(itemValue) > Number(filterValue);
    case '<':
      return Number(itemValue) < Number(filterValue);
    case '>=':
      return Number(itemValue) >= Number(filterValue);
    case '<=':
      return Number(itemValue) <= Number(filterValue);
    case '!=':
      return normalizedItemValue !== normalizedFilterValue;
    case 'IN':
      const inValues = filterValue.split(',').map(v => v.trim().toLowerCase());
      return inValues.includes(normalizedItemValue);
    case 'NOT IN':
      const notInValues = filterValue.split(',').map(v => v.trim().toLowerCase());
      return !notInValues.includes(normalizedItemValue);
    default:
      return normalizedItemValue.includes(normalizedFilterValue);
  }
};