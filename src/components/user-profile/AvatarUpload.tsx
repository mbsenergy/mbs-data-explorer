import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onAvatarUpdate: () => void;
}

export const AvatarUpload = ({ avatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploading(true);
      
      // First, try to remove the old avatar if it exists
      if (avatarUrl) {
        const oldFilePath = avatarUrl.split('/').slice(-2).join('/'); // Get the path from the URL
        if (oldFilePath) {
          const { error: deleteError } = await supabase.storage
            .from("avatars")
            .remove([oldFilePath]);
          
          if (deleteError) {
            console.error("Error deleting old avatar:", deleteError);
            // Continue with upload even if delete fails
          }
        }
      }

      // Create a folder structure with user ID
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }

      toast.success("Avatar updated successfully");
      onAvatarUpdate();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage 
          src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} 
          alt="avatar" 
        />
        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={isUploading}
          className="hidden"
          id="avatar-upload"
        />
        <Label htmlFor="avatar-upload">
          <Button 
            type="button" 
            variant="outline" 
            disabled={isUploading}
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            {isUploading ? "Uploading..." : "Change Avatar"}
          </Button>
        </Label>
      </div>
    </div>
  );
};