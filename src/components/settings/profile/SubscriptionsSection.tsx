import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubscriptionToggle = (option: string) => {
    const newSubscriptions = subscriptions.includes(option)
      ? subscriptions.filter(s => s !== option)
      : [...subscriptions, option];
    onSubscriptionsChange(newSubscriptions);
  };

  return (
    <Card className="relative">
      <CardHeader 
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-muted-foreground" />
          <CardTitle>Subscriptions</CardTitle>
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? "▼" : "▶"}
        </button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {SUBSCRIPTION_OPTIONS.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={subscriptions.includes(option)}
                  onCheckedChange={() => {
                    if (isEditing) {
                      handleSubscriptionToggle(option);
                    }
                  }}
                  disabled={!isEditing}
                />
                <Label
                  htmlFor={option}
                  className={!isEditing ? "text-muted-foreground" : ""}
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};