import { Sparkles, Brain } from "lucide-react";
import { LoginForm } from "~/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - ModelMerge",
  description: "Sign in to your ModelMerge account and start earning rewards from AI predictions",
};

// Static page - no dynamic data needed
export const dynamic = 'force-static';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, oklch(var(--muted-foreground) / 0.05) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
      
      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo and Branding - Enhanced */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary text-white mb-6 shadow-lg hover:scale-105 transition-transform duration-300 relative">
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl" />
            <Brain className="h-10 w-10 relative" />
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            Welcome to <span className="text-gradient">ModelMerge</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Sign in to start earning rewards from AI predictions
          </p>
        </div>
        
        {/* Login Form Card - Enhanced */}
        <div className="card-elegant p-10 shadow-2xl backdrop-blur-sm">
          <LoginForm />
        </div>
        
        {/* Footer - Refined */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors">
              Sign up for free
            </a>
          </p>
        </div>
        
        {/* Trust Badge - Enhanced */}
        <div className="mt-8 flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
          <span className="font-medium">Secured by blockchain technology</span>
        </div>
      </div>
    </div>
  );
}
