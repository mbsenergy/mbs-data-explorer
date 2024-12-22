import { DeveloperSection } from "@/components/developer/DeveloperSection";

const Developer = () => {
  const sections = ['presets', 'macros', 'developer', 'models'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Developer Resources</h1>
      {sections.map(section => (
        <DeveloperSection key={section} section={section} />
      ))}
    </div>
  );
};

export default Developer;