import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExcelSheetSelectorProps {
  sheets: string[];
  selectedSheet: string;
  onSheetSelect: (sheet: string) => void;
  headerRow: string;
  onHeaderRowChange: (row: string) => void;
}

export const ExcelSheetSelector = ({
  sheets,
  selectedSheet,
  onSheetSelect,
  headerRow,
  onHeaderRowChange
}: ExcelSheetSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium">Select Sheet</label>
        <Select value={selectedSheet} onValueChange={onSheetSelect}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Select a sheet" />
          </SelectTrigger>
          <SelectContent>
            {sheets.map((sheet) => (
              <SelectItem key={sheet} value={sheet} className="text-xs">
                {sheet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">Header Row</label>
        <Select value={headerRow} onValueChange={onHeaderRowChange}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Select header row" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((num) => (
              <SelectItem key={num} value={num.toString()} className="text-xs">
                Row {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};