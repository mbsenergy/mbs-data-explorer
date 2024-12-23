import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLoginHistory } from "@/hooks/useLoginHistory";
import { useAuth } from "@/components/auth/AuthProvider";

export const LoginHistory = () => {
  const { user } = useAuth();
  const { data: logins, isLoading } = useLoginHistory(user?.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Login History</h2>
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Login History</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Login Date</TableHead>
              <TableHead>Login Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logins?.map((login) => (
              <TableRow key={login.id}>
                <TableCell>
                  {format(new Date(login.logged_in_at), "PPP")}
                </TableCell>
                <TableCell>
                  {format(new Date(login.logged_in_at), "p")}
                </TableCell>
              </TableRow>
            ))}
            {!logins?.length && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No login history available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};