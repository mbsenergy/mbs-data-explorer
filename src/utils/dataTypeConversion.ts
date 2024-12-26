import { parse, isValid } from "date-fns";

export const convertDataType = (value: any, type: string): any => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  try {
    switch (type) {
      case 'number':
        const num = Number(value);
        return isNaN(num) ? value : num;
      
      case 'date':
        // Try different date formats
        const formats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy'];
        for (const format of formats) {
          const date = parse(value, format, new Date());
          if (isValid(date)) {
            return date;
          }
        }
        return value;
      
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
    return value;
  }
};

export const convertDatasetColumns = (
  data: any[],
  columnTypes: { [key: string]: string }
): any[] => {
  return data.map(row => {
    const newRow = { ...row };
    Object.entries(columnTypes).forEach(([column, type]) => {
      if (column in row) {
        newRow[column] = convertDataType(row[column], type);
      }
    });
    return newRow;
  });
};