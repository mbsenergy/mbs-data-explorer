import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, LogOut, Save } from "lucide-react";
import { CollapsibleCard } from "@/components/ui/collapsible-card";

interface MainInfoSectionProps {
  profile: any;
  user: any;
  formData: any;
  setFormData: (data: any) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  handleSave: () => void;
  isSaving?: boolean;
}

export const MainInfoSection = ({
  profile,
  user,
  formData,
  setFormData,
  handleImageUpload,
  handleLogout,
  handleSave,
  isSaving = false
}: MainInfoSectionProps) => {
  return (
    <CollapsibleCard title="Main Information" defaultOpen={true}>
      <div className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <p className="text-muted-foreground">
              {profile?.is_cerved ? "Cerved User" : "Standard User"}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={e => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={e => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleLogout} type="button">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </CollapsibleCard>
  );
};