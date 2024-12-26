import { ColumnDataType } from "@/types/columns";

export const convertValue = (value: any, type: ColumnDataType): any => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  try {
    switch (type) {
      case 'number':
        const num = Number(value);
        return isNaN(num) ? null : num;
      
      case 'date':
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      
      case 'boolean':
        if (typeof value === 'string') {
          const lowered = value.toLowerCase();
          if (['true', '1', 'yes'].includes(lowered)) return true;
          if (['false', '0', 'no'].includes(lowered)) return false;
        }
        return Boolean(value);
      
      case 'text':
      default:
        return String(value);
    }
  } catch (error) {
    console.error(`Error converting value ${value} to type ${type}:`, error);
    return null;
  }
};

export const convertDataset = (data: any[], columnTypes: { name: string; type: ColumnDataType }[]): any[] => {
  return data.map(row => {
    const newRow = { ...row };
    columnTypes.forEach(({ name, type }) => {
      if (name in row) {
        newRow[name] = convertValue(row[name], type);
      }
    });
    return newRow;
  });
};