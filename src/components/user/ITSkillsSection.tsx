import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Label } from "@/components/ui/label";

interface ITSkillsSectionProps {
  formData: any;
  handleCheckboxChange: (field: 'it_skills' | 'preferred_data' | 'subscriptions', value: string) => void;
}

const IT_SKILLS = ["Python", "R", "Ruby", "Excel VBA", "REST API", "Rust", "SQL", "NoSQL"];

export const ITSkillsSection = ({
  formData,
  handleCheckboxChange
}: ITSkillsSectionProps) => {
  return (
    <CollapsibleCard title="IT Skills">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IT_SKILLS.map(skill => (
            <label key={skill} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.it_skills.includes(skill)}
                onChange={() => handleCheckboxChange('it_skills', skill)}
                className="form-checkbox h-4 w-4"
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>
    </CollapsibleCard>
  );
};