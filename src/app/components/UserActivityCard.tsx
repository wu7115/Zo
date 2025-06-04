import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints, Flame, Smile, Zap, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Metric {
  icon: React.ElementType;
  label: string;
  value: string;
}

const userActivity = {
  timestamp: "2 hours ago",
  type: "Evening Run",
  details: "Completed a 5km run through the park. Felt invigorating!",
  activityIcon: Footprints,
  metrics: [
    { icon: Zap, label: "Distance", value: "5 km" },
    { icon: Flame, label: "Calories", value: "350 kcal" },
    { icon: Smile, label: "Mood", value: "Energized" },
  ],
};

export function UserActivityCard() {
  const ActivityIcon = userActivity.activityIcon || Zap;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-headline text-primary flex items-center">
              <ActivityIcon className="h-6 w-6 mr-2 text-accent" />
              {userActivity.type}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground flex items-center mt-1">
              <CalendarDays className="h-3 w-3 mr-1" /> {userActivity.timestamp}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-primary text-primary">You</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-foreground/90">{userActivity.details}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {userActivity.metrics.map((metric) => (
            <div key={metric.label} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md">
              <metric.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-sm font-semibold text-primary">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
