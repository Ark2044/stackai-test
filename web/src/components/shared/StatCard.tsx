import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-primary",
  trend,
  trendValue
}: StatCardProps) {
  return (
    <Card className="card-modern border-0 shadow-lg hover-lift overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-transform group-hover:scale-110",
          "bg-primary/10"
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold mb-1">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {trendValue && (
              <span className={cn(
                "font-medium",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-muted-foreground"
              )}>
                {trendValue}
              </span>
            )}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
