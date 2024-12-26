import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Bell, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SUBSCRIPTION_OPTIONS = [
  "Flux catalog & news",
  "Scenario Report",
  "Osservatorio Energia",
  "Newsletter",
  "Insights",
  "Services"
];

interface SubscriptionsSectionProps {
  isEditing: boolean;
  subscriptions: string[];
  onSubscriptionsChange: (subscriptions: string[]) => void;
}

export const SubscriptionsSection = ({
  isEditing,
  subscriptions,
  onSubscriptionsChange,
}: SubscriptionsSectionProps) => {
  const { toast } = useToast();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(subscriptions);
  const [isSaving, setSaving] = useState(false);

  const handleSubscriptionToggle = (option: string) => {
    if (!isEditing) return;
    
    setSelectedSubscriptions(prev => 
      prev.includes(option) 
        ? prev.filter(s => s !== option)
        : [...prev, option]
    );
  };

  const handleSave = async () => {
    if (!isEditing) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscriptions: selectedSubscriptions })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      onSubscriptionsChange(selectedSubscriptions);
      toast({
        title: "Success",
        description: "Your subscriptions have been updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to update subscriptions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CollapsibleCard 
      title="Subscriptions" 
      icon={<Bell className="h-5 w-5" />}
      defaultOpen={true}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {SUBSCRIPTION_OPTIONS.map((option) => (
            <div 
              key={option} 
              className={`
                flex items-center space-x-2 p-3 rounded-lg transition-all
                ${isEditing ? 'cursor-pointer hover:bg-muted/50' : ''}
                ${selectedSubscriptions.includes(option) ? 'bg-muted/30' : ''}
              `}
              onClick={() => handleSubscriptionToggle(option)}
            >
              <Checkbox
                id={option}
                checked={selectedSubscriptions.includes(option)}
                onCheckedChange={() => handleSubscriptionToggle(option)}
                disabled={!isEditing}
                className={isEditing ? "cursor-pointer" : ""}
              />
              <Label
                htmlFor={option}
                className={`
                  flex-1
                  ${isEditing ? 'cursor-pointer' : 'text-muted-foreground'}
                  ${selectedSubscriptions.includes(option) ? 'font-medium' : ''}
                `}
              >
                {option}
              </Label>
              {selectedSubscriptions.includes(option) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex justify-end pt-4">
            <Button 
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Subscriptions"}
            </Button>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};