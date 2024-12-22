import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface AnalyticsData {
  id: string;
  dataset_name: string;
  is_custom_query: boolean;
  downloaded_at: string;
}

interface DownloadsTableProps {
  analyticsData: AnalyticsData[] | null;
  analyticsLoading: boolean;
}

export const DownloadsTable = ({ analyticsData, analyticsLoading }: DownloadsTableProps) => {
  return (
    <Card className="p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4">Download History</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dataset</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyticsLoading ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : analyticsData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No downloads yet
                </TableCell>
              </TableRow>
            ) : (
              analyticsData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.is_custom_query ? "Custom Query" : item.dataset_name}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.downloaded_at), 'dd MMM yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};