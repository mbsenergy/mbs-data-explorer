import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechStackCardProps {
  skills: string[] | null;
}

export const TechStackCard = ({ skills = [] }: TechStackCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Tech Stack</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-[#D3E4FD] hover:bg-[#E5DEFF] text-[#9b87f5]"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};