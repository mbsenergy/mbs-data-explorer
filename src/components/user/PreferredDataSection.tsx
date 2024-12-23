import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Label } from "@/components/ui/label";

interface PreferredDataSectionProps {
  formData: any;
  handleCheckboxChange: (field: 'it_skills' | 'preferred_data' | 'subscriptions', value: string) => void;
}

const PREFERRED_DATA = ["Electricity", "Gas", "Commodities", "Scenario & Outlooks", "Reports", "Regulation & Compliance", "Strategy", "Risk"];

export const PreferredDataSection = ({
  formData,
  handleCheckboxChange
}: PreferredDataSectionProps) => {
  return (
    <CollapsibleCard title="Preferred Data">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PREFERRED_DATA.map(data => (
            <label key={data} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferred_data.includes(data)}
                onChange={() => handleCheckboxChange('preferred_data', data)}
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