import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { CollapsibleCard } from "@/components/ui/collapsible-card";

export const ContactSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Please log in again to send a message");
      }

      const { error } = await supabase.functions.invoke('send-support-email', {
        body: {
          from: user?.email,
          to: ["support@example.com"],
          subject: subject,
          html: `
            <p><strong>From:</strong> ${user?.email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully!",
        className: "bg-primary text-white"
      });

      // Clear form
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CollapsibleCard title="Contact Support" icon={<Mail className="h-5 w-5" />}>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we help?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue or question..."
            className="min-h-[100px]"
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </CollapsibleCard>
  );
};
