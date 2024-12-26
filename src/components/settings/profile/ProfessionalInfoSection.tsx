import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Github, Linkedin } from "lucide-react";

interface ProfessionalInfoSectionProps {
  isEditing: boolean;
  profile: {
    company: string | null;
    role: string | null;
    github_url: string | null;
    linkedin_url: string | null;
  };
  onProfileChange: (field: string, value: string) => void;
}

export const ProfessionalInfoSection = ({
  isEditing,
  profile,
  onProfileChange,
}: ProfessionalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <div className="flex-1">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company || ""}
                onChange={(e) => onProfileChange("company", e.target.value)}
              />
            </div>
          ) : (
            <span>{profile.company || "Add company"}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <div className="flex-1">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={profile.role || ""}
                onChange={(e) => onProfileChange("role", e.target.value)}
              />
            </div>
          ) : (
            <span>{profile.role || "Add role"}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              placeholder="GitHub Profile URL"
              value={profile.github_url || ""}
              onChange={(e) => onProfileChange("github_url", e.target.value)}
            />
          ) : (
            <a
              href={profile.github_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.github_url || "Add GitHub profile"}
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              placeholder="LinkedIn Profile URL"
              value={profile.linkedin_url || ""}
              onChange={(e) => onProfileChange("linkedin_url", e.target.value)}
            />
          ) : (
            <a
              href={profile.linkedin_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.linkedin_url || "Add LinkedIn profile"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};