import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className,
  iconClassName 
}: FeatureCardProps) {
  return (
    <div className={cn(
      "card-modern p-6 hover-lift group cursor-pointer",
      className
    )}>
      <div className={cn(
        "mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary",
        "group-hover:scale-110 transition-transform",
        iconClassName
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
