import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubscriptionsCardProps {
  subscriptions: string[] | null;
}

export const SubscriptionsCard = ({ subscriptions = [] }: SubscriptionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Subscriptions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {subscriptions && subscriptions.length > 0 ? (
            subscriptions.map((subscription, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-[#F1F0FB] hover:bg-[#E5DEFF] text-[#9b87f5]"
              >
                {subscription}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No active subscriptions</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};