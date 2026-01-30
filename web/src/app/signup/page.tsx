import { Sparkles, Brain, UserPlus } from "lucide-react";
import { SignUpForm } from "~/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - ModelMerge",
  description: "Create your ModelMerge account and start earning rewards from AI model predictions",
};

// Static page - no dynamic data needed
export const dynamic = 'force-static';

export default function SignPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-size-[75px_75px] dark:bg-grid-slate-100/[0.03]" />
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary/80 text-white mb-4 shadow-lg hover:scale-110 transition-transform">
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Join <span className="text-gradient">ModelMerge</span>
          </h1>
          <p className="text-muted-foreground">
            Create your account and start earning rewards today
          </p>
        </div>
        
        {/* Signup Form Card */}
        <div className="card-modern p-8 shadow-xl">
          <SignUpForm />
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
        
        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Join thousands earning with AI predictions</span>
        </div>
      </div>
    </div>
  );
}
