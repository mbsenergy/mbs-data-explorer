import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Track the login
      await supabase.from('user_logins').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 ai-gradient opacity-50" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Animated background shapes */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-corporate-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-corporate-teal rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
      
      <Card className="w-full max-w-md p-8 metallic-card relative z-10 shimmer">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <img 
              src="/lovable-uploads/5c908079-22b4-4807-83e2-573ab0d0f160.png" 
              alt="Company Logo" 
              className="h-12 mb-4 animate-float"
            />
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-corporate-teal">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-white/10 focus:border-corporate-teal transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-white/10 focus:border-corporate-teal transition-colors"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-corporate-blue to-corporate-teal hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;