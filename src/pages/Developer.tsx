import { useState, useEffect } from "react";
import { DeveloperSection } from "@/components/developer/DeveloperSection";
import { DeveloperSearch } from "@/components/developer/DeveloperSearch";
import { useDeveloperFiles } from "@/hooks/useDeveloperFiles";

const Developer = () => {
  const sections = ['presets', 'macros', 'developer', 'models'];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch files from all sections to get available tags
  const results = sections.map(section => {
    const { data: files } = useDeveloperFiles(section);
    return files || [];
  }).flat();

  // Extract unique tags
  useEffect(() => {
    const tags = [...new Set(results.map(file => file.field))];
    setAvailableTags(tags);
  }, [results]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Developer Resources</h1>
      <DeveloperSearch
        onSearchChange={setSearchTerm}
        onTagChange={setSelectedTag}
        availableTags={availableTags}
      />
      {sections.map(section => (
        <DeveloperSection 
          key={section} 
          section={section}
          searchTerm={searchTerm}
          selectedTag={selectedTag}
        />
      ))}
    </div>
  );
};

export default Developer;