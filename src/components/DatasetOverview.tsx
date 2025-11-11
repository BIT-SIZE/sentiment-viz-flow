import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, TrendingUp, BarChart3 } from "lucide-react";

export const DatasetOverview = () => {
  const stats = [
    { label: "Total Tweets", value: "14,873", icon: Database, color: "text-primary" },
    { label: "Positive", value: "2,363", icon: TrendingUp, color: "text-positive" },
    { label: "Negative", value: "9,178", icon: BarChart3, color: "text-negative" },
    { label: "Neutral", value: "3,332", icon: Database, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Airline sentiment dataset
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
