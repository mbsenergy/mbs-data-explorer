import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleCard = ({ title, children, className }: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className={`p-6 metallic-card ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};