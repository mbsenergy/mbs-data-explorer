import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileFormProps {
  profile: any;
  onProfileUpdate: () => void;
  userId: string;
}

export const ProfileForm = ({ profile, onProfileUpdate, userId }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    role: "",
    company: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when profile changes
  useEffect(() => {
    console.log("Profile data received:", profile);
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : "",
        role: profile.role || "",
        company: profile.company || "",
        country: profile.country || "",
      });
    }
  }, [profile]); // Only depend on profile to avoid unnecessary re-renders

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      console.error("No user ID available");
      toast.error("Unable to update profile: No user ID available");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Starting profile update...");
      console.log("User ID:", userId);
      console.log("Form data to be sent:", formData);

      const updateData = {
        id: userId,
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        date_of_birth: formData.date_of_birth || null,
        role: formData.role || null,
        company: formData.company || null,
        country: formData.country || null,
        updated_at: new Date().toISOString(),
      };

      console.log("Formatted update data:", updateData);
      
      const { error, data } = await supabase
        .from("profiles")
        .upsert(updateData)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Profile updated successfully:", data);
      toast.success("Profile updated successfully");
      onProfileUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};