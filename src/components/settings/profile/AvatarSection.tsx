import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface AvatarSectionProps {
  avatarUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  onAvatarUpdate: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>;
}

export const AvatarSection = ({ 
  avatarUrl, 
  firstName, 
  lastName,
  onAvatarUpdate 
}: AvatarSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}` || "U";
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        toast({
          title: "Error uploading avatar",
          description: uploadError.message,
          variant: "destructive",
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        toast({
          title: "Error updating profile",
          description: updateError.message,
          variant: "destructive",
        });
        return;
      }

      await onAvatarUpdate();
      toast({
        title: "Avatar updated successfully",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Error uploading avatar",
        description: "An unexpected error occurred while uploading your avatar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="text-lg">
          {getInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        id="avatar-upload"
        onChange={handleAvatarUpload}
      />
      <Label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 rounded-full bg-primary p-1 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-white"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </Label>
    </div>
  );
};