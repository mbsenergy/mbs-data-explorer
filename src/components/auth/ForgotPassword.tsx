import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ForgotPassword = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown) {
      toast({
        title: "Please wait",
        description: `You can try again in ${cooldownTime} seconds`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = window.location.origin;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/login`,
      });

      if (error) {
        // Check if it's a rate limit error
        if (error.message.includes('rate_limit')) {
          const timeMatch = error.message.match(/\d+/);
          const waitTime = timeMatch ? parseInt(timeMatch[0]) : 60;
          setCooldownTime(waitTime);
          setCooldown(true);
          
          // Start countdown
          const timer = setInterval(() => {
            setCooldownTime((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setCooldown(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          throw new Error(`Please wait ${waitTime} seconds before requesting another reset link.`);
        }
        throw error;
      }

      setSuccess(true);
      toast({
        title: "Success",
        description: "Check your email for the password reset link",
        style: { backgroundColor: "#57D7E2", color: "white" }
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-corporate-teal">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Check your email for the password reset link
            </AlertDescription>
          </Alert>
          <Button 
            onClick={onBack}
            className="w-full"
            variant="outline"
          >
            Back to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-white/10 focus:border-corporate-teal transition-colors"
              disabled={loading || cooldown}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-corporate-blue to-corporate-teal hover:opacity-90 transition-opacity"
            disabled={loading || cooldown}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : cooldown ? (
              `Wait ${cooldownTime}s`
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <Button 
            onClick={onBack}
            className="w-full"
            variant="outline"
          >
            Back to Login
          </Button>
        </form>
      )}
    </div>
  );
};