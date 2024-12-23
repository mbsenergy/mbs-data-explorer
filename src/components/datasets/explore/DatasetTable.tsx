import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DatasetTableProps {
  columns: string[];
  data: any[];
  selectedColumns: string[];
}

export const DatasetTable = ({ columns, data, selectedColumns }: DatasetTableProps) => {
  return (
    <div className="border rounded-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selectedColumns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {selectedColumns.map((col) => (
                  <TableCell key={col} className="whitespace-nowrap">
                    {String(item[col])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};