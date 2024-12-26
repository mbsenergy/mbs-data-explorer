import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const handleSubscriptionToggle = (option: string) => {
    if (!isEditing) return;
    
    const newSubscriptions = subscriptions.includes(option)
      ? subscriptions.filter(s => s !== option)
      : [...subscriptions, option];
    onSubscriptionsChange(newSubscriptions);
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
              className="flex items-center space-x-2"
              onClick={() => isEditing && handleSubscriptionToggle(option)}
            >
              <Checkbox
                id={option}
                checked={subscriptions.includes(option)}
                onCheckedChange={() => handleSubscriptionToggle(option)}
                disabled={!isEditing}
                className="cursor-pointer"
              />
              <Label
                htmlFor={option}
                className={`${!isEditing ? "text-muted-foreground" : "cursor-pointer"}`}
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => onSubscriptionsChange(subscriptions)}
            >
              Save Subscriptions
            </Button>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};