import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Flame, Timer, Activity } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value, unit }) => (
  <div className="flex items-center space-x-3 p-3 bg-secondary/20 rounded-lg">
    <Icon className="h-8 w-8 text-primary" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-primary">
        {value} <span className="text-sm font-normal">{unit}</span>
      </p>
    </div>
  </div>
);

const weeklyStats = [
  { icon: Dumbbell, label: "Workouts", value: "4", unit: "sessions" },
  { icon: Flame, label: "Calories Burned", value: "1850", unit: "kcal" },
  { icon: Timer, label: "Active Minutes", value: "210", unit: "min" },
  { icon: Activity, label: "Avg. Mood", value: "4.2", unit: "/ 5" },
];

export function WeeklySnapshotCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">Your Week at a Glance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {weeklyStats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
