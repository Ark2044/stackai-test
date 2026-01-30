import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 opacity-50" />
        <div className="orb orb-2 opacity-50" />
        <div className="orb orb-3 opacity-40" />
      </div>
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative z-10 text-center animate-fade-in">
        {/* Animated Logo/Icon */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-primary/20 animate-ping opacity-20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 backdrop-blur-xl">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-2xl font-bold tracking-tight">
            Model<span className="text-gradient">Merge</span>
          </span>
        </div>
        <p className="text-muted-foreground text-lg">Loading your experience...</p>
        
        {/* Animated Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
