import { SavedQueriesDisplay } from "@/components/developer/SavedQueriesDisplay";
import { BucketUpload } from "@/components/developer/BucketUpload";
import { useToast } from "@/hooks/use-toast";

export const PersonalContent = () => {
  const { toast } = useToast();

  const handleSelectQuery = (query: string) => {
    console.log('Selected query:', query);
    toast({
      title: "Query Selected",
      description: "Query loaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <SavedQueriesDisplay onSelectQuery={handleSelectQuery} />
      <BucketUpload />
    </div>
  );
};