import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SUBSCRIPTION_OPTIONS, TECH_STACK_OPTIONS } from "@/constants/profileOptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Rss } from "lucide-react";

interface SkillsAndSubscriptionsProps {
  isEditing: boolean;
  subscriptions: string[] | null;
  itSkills: string[] | null;
  onSubscriptionsChange: (subscriptions: string[]) => void;
  onSkillsChange: (skills: string[]) => void;
}

export const SkillsAndSubscriptions = ({
  isEditing,
  subscriptions = [],
  itSkills = [],
  onSubscriptionsChange,
  onSkillsChange,
}: SkillsAndSubscriptionsProps) => {
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(subscriptions || []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(itSkills || []);

  const handleSubscriptionChange = (subscription: string, checked: boolean) => {
    const updatedSubscriptions = checked
      ? [...selectedSubscriptions, subscription]
      : selectedSubscriptions.filter((s) => s !== subscription);
    
    setSelectedSubscriptions(updatedSubscriptions);
    onSubscriptionsChange(updatedSubscriptions);
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    const updatedSkills = checked
      ? [...selectedSkills, skill]
      : selectedSkills.filter((s) => s !== skill);
    
    setSelectedSkills(updatedSkills);
    onSkillsChange(updatedSkills);
  };

  if (!isEditing) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rss className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Subscriptions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {SUBSCRIPTION_OPTIONS.map((subscription) => (
              <div key={subscription} className="flex items-center space-x-2">
                <Checkbox
                  id={`subscription-${subscription}`}
                  checked={selectedSubscriptions.includes(subscription)}
                  onCheckedChange={(checked) => 
                    handleSubscriptionChange(subscription, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`subscription-${subscription}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {subscription}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Tech Stack</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {TECH_STACK_OPTIONS.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={selectedSkills.includes(skill)}
                  onCheckedChange={(checked) => 
                    handleSkillChange(skill, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`skill-${skill}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};