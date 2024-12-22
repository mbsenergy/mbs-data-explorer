import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Camera, Github, Linkedin, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const IT_SKILLS = ["Python", "R", "Ruby", "Excel VBA", "REST API", "Rust", "SQL", "NoSQL"];
const PREFERRED_DATA = ["Electricity", "Gas", "Commodities", "Scenario & Outlooks", "Reports", "Regulation & Compliance", "Strategy", "Risk"];
const SUBSCRIPTIONS = ["Data with Flux", "Newsletter", "Osservatorio Energia", "Scenario Report", "Tailored Reports", "Consultancy"];

const User = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    date_of_birth: profile?.date_of_birth || "",
    country: profile?.country || "",
    company: profile?.company || "",
    role: profile?.role || "",
    linkedin_url: profile?.linkedin_url || "",
    github_username: profile?.github_username || "",
    it_skills: profile?.it_skills || [],
    preferred_data: profile?.preferred_data || [],
    subscriptions: profile?.subscriptions || [],
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUpdating(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      await refetch();
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckboxChange = (field: 'it_skills' | 'preferred_data' | 'subscriptions', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
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
                onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={e => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedin"
                value={formData.linkedin_url}
                onChange={e => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Username
              </Label>
              <Input
                id="github"
                value={formData.github_username}
                onChange={e => setFormData(prev => ({ ...prev, github_username: e.target.value }))}
                placeholder="username"
              />
            </div>
          </div>

          {/* IT Skills */}
          <div className="space-y-4">
            <Label>IT Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {IT_SKILLS.map(skill => (
                <label key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.it_skills.includes(skill)}
                    onChange={() => handleCheckboxChange('it_skills', skill)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Data */}
          <div className="space-y-4">
            <Label>Preferred Data</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PREFERRED_DATA.map(data => (
                <label key={data} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferred_data.includes(data)}
                    onChange={() => handleCheckboxChange('preferred_data', data)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span>{data}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subscriptions */}
          <div className="space-y-4">
            <Label>Subscriptions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SUBSCRIPTIONS.map(sub => (
                <label key={sub} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.subscriptions.includes(sub)}
                    onChange={() => handleCheckboxChange('subscriptions', sub)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button type="submit" disabled={isUpdating}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleLogout} type="button">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default User;