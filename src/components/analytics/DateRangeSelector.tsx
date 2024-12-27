import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
}

export const DateRangeSelector = ({ dateRange, onDateChange }: DateRangeSelectorProps) => {
  return (
    <DatePickerWithRange
      date={dateRange}
      onDateChange={onDateChange}
    />
  );
};