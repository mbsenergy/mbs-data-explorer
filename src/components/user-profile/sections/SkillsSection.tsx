import { CollapsibleCard } from "@/components/ui/collapsible-card";

const IT_SKILLS = ["Python", "R", "Ruby", "Excel VBA", "REST API", "Rust", "SQL", "NoSQL"];

interface SkillsSectionProps {
  skills: string[];
  onSkillToggle: (skill: string) => void;
}

export const SkillsSection = ({ skills, onSkillToggle }: SkillsSectionProps) => {
  return (
    <CollapsibleCard title="IT Skills">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IT_SKILLS.map(skill => (
            <label key={skill} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={skills.includes(skill)}
                onChange={() => onSkillToggle(skill)}
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