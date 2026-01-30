import { GitMerge } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[500px] h-[500px] bg-primary/20 -top-32 -left-32"></div>
        <div className="orb w-[400px] h-[400px] bg-accent/15 bottom-20 -right-20 animation-delay-2000"></div>
      </div>
      <div className="fixed inset-0 gradient-mesh opacity-20 pointer-events-none"></div>
      
      {/* Loader */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 to-accent/40 blur-xl animate-pulse"></div>
          <div className="relative p-6 rounded-2xl card-glass">
            <GitMerge className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-primary/20 animate-ping"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gradient">Loading merge request...</p>
          <p className="text-sm text-muted-foreground mt-1">Preparing your workspace</p>
        </div>
        
        {/* Skeleton Preview */}
        <div className="w-80 space-y-3 mt-4">
          <div className="h-3 bg-muted/50 rounded-full animate-pulse"></div>
          <div className="h-3 bg-muted/30 rounded-full w-2/3 animate-pulse"></div>
          <div className="h-3 bg-muted/20 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
