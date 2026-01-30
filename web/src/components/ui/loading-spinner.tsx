import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
}

interface LoadingOverlayProps {
  text?: string;
}

export function LoadingOverlay({ text = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

interface PageLoadingProps {
  text?: string;
}

export function PageLoading({ text = "Loading..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card-modern p-12 text-center animate-fade-in-up">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}
