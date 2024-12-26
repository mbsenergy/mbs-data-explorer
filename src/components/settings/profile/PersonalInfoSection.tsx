import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <Label htmlFor="firstName">First Name</Label>
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
        <Label htmlFor="lastName">Last Name</Label>
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
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
        <Label htmlFor="country">Country</Label>
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