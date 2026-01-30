import { Loader2, BarChart3 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 opacity-40" />
        <div className="orb orb-2 opacity-40" />
      </div>
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="relative z-10 text-center animate-fade-in">
        {/* Animated Loader */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping opacity-30" />
          </div>
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-xl font-semibold">Loading Dashboard</span>
        </div>
        <p className="text-muted-foreground">Fetching your data...</p>
        
        {/* Loading Skeleton Preview */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="h-24 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
