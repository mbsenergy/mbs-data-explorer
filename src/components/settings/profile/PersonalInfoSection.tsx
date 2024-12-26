import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar, Globe } from "lucide-react";

interface PersonalInfoSectionProps {
  isEditing: boolean;
  profile: {
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    country: string | null;
  };
  onProfileChange: (field: string, value: string) => void;
}

export const PersonalInfoSection = ({
  isEditing,
  profile,
  onProfileChange,
}: PersonalInfoSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="firstName">First Name</Label>
        </div>
        {isEditing ? (
          <Input
            id="firstName"
            value={profile.first_name || ""}
            onChange={(e) => onProfileChange("first_name", e.target.value)}
          />
        ) : (
          <p className="mt-1">{profile.first_name || "Not set"}</p>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="lastName">Last Name</Label>
        </div>
        {isEditing ? (
          <Input
            id="lastName"
            value={profile.last_name || ""}
            onChange={(e) => onProfileChange("last_name", e.target.value)}
          />
        ) : (
          <p className="mt-1">{profile.last_name || "Not set"}</p>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
        </div>
        {isEditing ? (
          <Input
            id="dateOfBirth"
            type="date"
            value={profile.date_of_birth || ""}
            onChange={(e) => onProfileChange("date_of_birth", e.target.value || null)}
          />
        ) : (
          <p className="mt-1">
            {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "Not set"}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="country">Country</Label>
        </div>
        {isEditing ? (
          <Input
            id="country"
            value={profile.country || ""}
            onChange={(e) => onProfileChange("country", e.target.value)}
          />
        ) : (
          <p className="mt-1">{profile.country || "Not set"}</p>
        )}
      </div>
    </div>
  );
};