import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";

export const UserProfileTable = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  const profileData = [
    { label: "Email", value: profile?.email || user?.email },
    { label: "First Name", value: profile?.first_name || "Not set" },
    { label: "Last Name", value: profile?.last_name || "Not set" },
    { label: "Date of Birth", value: profile?.date_of_birth ? format(new Date(profile.date_of_birth), "PPP") : "Not set" },
    { label: "Role", value: profile?.role || "Not set" },
    { label: "Company", value: profile?.company || "Not set" },
    { label: "Country", value: profile?.country || "Not set" },
    { label: "Created At", value: profile?.created_at ? format(new Date(profile.created_at), "PPP") : "Not set" },
    { label: "Last Updated", value: profile?.updated_at ? format(new Date(profile.updated_at), "PPP") : "Not set" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Profile Information</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profileData.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};