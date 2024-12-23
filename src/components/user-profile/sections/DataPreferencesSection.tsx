import { CollapsibleCard } from "@/components/ui/collapsible-card";

const PREFERRED_DATA = [
  "Electricity",
  "Gas",
  "Commodities",
  "Scenario & Outlooks",
  "Reports",
  "Regulation & Compliance",
  "Strategy",
  "Risk"
];

interface DataPreferencesSectionProps {
  preferences: string[];
  onPreferenceToggle: (preference: string) => void;
}

export const DataPreferencesSection = ({
  preferences,
  onPreferenceToggle
}: DataPreferencesSectionProps) => {
  return (
    <CollapsibleCard title="Preferred Data">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PREFERRED_DATA.map(data => (
            <label key={data} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.includes(data)}
                onChange={() => onPreferenceToggle(data)}
                className="form-checkbox h-4 w-4"
              />
              <span>{data}</span>
            </label>
          ))}
        </div>
      </div>
    </CollapsibleCard>
  );
};