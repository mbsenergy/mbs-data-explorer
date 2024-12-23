import { CollapsibleCard } from "@/components/ui/collapsible-card";

const SUBSCRIPTIONS = [
  "Data with Flux",
  "Newsletter",
  "Osservatorio Energia",
  "Scenario Report",
  "Tailored Reports",
  "Consultancy"
];

interface SubscriptionSectionProps {
  subscriptions: string[];
  onSubscriptionToggle: (subscription: string) => void;
}

export const SubscriptionSection = ({
  subscriptions,
  onSubscriptionToggle
}: SubscriptionSectionProps) => {
  return (
    <CollapsibleCard title="Subscriptions">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SUBSCRIPTIONS.map(sub => (
            <label key={sub} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={subscriptions.includes(sub)}
                onChange={() => onSubscriptionToggle(sub)}
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