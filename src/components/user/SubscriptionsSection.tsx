import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Label } from "@/components/ui/label";

interface SubscriptionsSectionProps {
  formData: any;
  handleCheckboxChange: (field: 'it_skills' | 'preferred_data' | 'subscriptions', value: string) => void;
}

const SUBSCRIPTIONS = ["Data with Flux", "Newsletter", "Osservatorio Energia", "Scenario Report", "Tailored Reports", "Consultancy"];

export const SubscriptionsSection = ({
  formData,
  handleCheckboxChange
}: SubscriptionsSectionProps) => {
  return (
    <CollapsibleCard title="Subscriptions">
      <div className="space-y-4">
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
    </CollapsibleCard>
  );
};