import Link from "next/link";
import { Brain, TrendingUp, Wallet, Vote, GitMerge, Sparkles, Shield, Zap, ArrowRight, CheckCircle2, Star, Users, Layers } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ModelMerge - Stake on AI Model Merges",
  description: "Win rewards by predicting successful AI model merges. Join the future of decentralized AI model validation.",
};

// Static page - can be statically generated
export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Immersive Aurora Design */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Animated Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern opacity-60" />
        
        {/* Aurora Mesh */}
        <div className="absolute inset-0 gradient-mesh" />
        
        <div className="container-responsive relative z-10 pt-20 pb-32 sm:pt-28 sm:pb-40 lg:pt-32 lg:pb-48">
          <div className="mx-auto max-w-6xl">
            {/* Floating Badge */}
            <div className="mb-10 flex justify-center animate-fade-in">
              <div className="group inline-flex items-center gap-3 rounded-full bg-primary/5 dark:bg-primary/10 px-6 py-3 text-sm font-medium border border-primary/20 backdrop-blur-xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-500 hover:scale-105 cursor-default shadow-lg">
                <div className="relative">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <div className="absolute inset-0 animate-ping">
                    <Sparkles className="h-4 w-4 text-primary opacity-40" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                  Powered by Blockchain & Smart Contracts
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            
            {/* Main Heading - Fluid Typography */}
            <h1 className="mb-8 text-center animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <span className="block text-fluid-xl font-bold tracking-tight mb-2 leading-[1.1]">
                Stake on
              </span>
              <span className="block text-fluid-xl font-bold tracking-tight leading-[1.1]">
                <span className="text-gradient">AI Model Merges</span>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="mb-14 text-center text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{animationDelay: '0.2s'}}>
              Win rewards when your predictions are correct. Join the future of 
              <span className="text-primary font-medium"> decentralized AI </span> 
              model validation and earn while contributing to better AI.
            </p>
            
            {/* CTA Buttons - Aurora Style */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <Link href="/signup" className="cursor-pointer">
                <Button size="lg" className="group relative gradient-primary text-white hover:opacity-95 transition-all text-base sm:text-lg px-10 sm:px-14 py-7 sm:py-8 h-auto font-semibold shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden cursor-pointer">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
              <Link href="/validators/models" className="cursor-pointer">
                <Button size="lg" variant="outline" className="group text-base sm:text-lg px-10 sm:px-14 py-7 sm:py-8 h-auto font-semibold bg-background/60 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer">
                  <Layers className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  Browse Models
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators - Modern Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
              {[
                { icon: Shield, label: "Blockchain Secured" },
                { icon: Zap, label: "Instant Rewards" },
                { icon: Users, label: "10K+ Validators" }
              ].map((item, i) => (
                <div key={i} className="group flex items-center gap-3 px-5 py-3 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md cursor-default select-none">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground transition-colors">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
      </section>

      {/* Features Section - Glassmorphic Cards */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        
        <div className="container-responsive relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent border border-accent/20 mb-6">
              <Star className="h-4 w-4" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-fluid-md font-bold mb-6 tracking-tight">
              Why Choose Model<span className="text-gradient">Merge</span>?
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
              Revolutionary platform combining AI, blockchain, and community-driven validation for the next generation of model optimization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Feature Cards */}
            {[
              {
                icon: Shield,
                title: "Secure & Transparent",
                description: "All transactions recorded on blockchain with complete transparency. Your stakes are protected by smart contracts.",
                gradient: "from-primary/20 to-primary/5"
              },
              {
                icon: Zap,
                title: "Lightning Fast Rewards",
                description: "Earn MMT tokens instantly when your predictions are correct. Automated, fair, and immediate distribution.",
                gradient: "from-accent/20 to-accent/5"
              },
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Leverage cutting-edge AI analysis to make informed decisions on model merges. Data-driven predictions.",
                gradient: "from-chart-3/20 to-chart-3/5"
              }
            ].map((feature, i) => (
              <div key={i} className="group card-elegant p-8 lg:p-10" style={{animationDelay: `${i * 0.1}s`}}>
                <div className={`mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-all duration-500`}>
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Timeline Style */}
      <section className="py-24 lg:py-32 relative bg-gradient-to-b from-secondary/10 via-background to-background">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="container-responsive relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 mb-6">
              <GitMerge className="h-4 w-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-fluid-md font-bold mb-6 tracking-tight">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
              Four simple steps to start earning from AI model predictions
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 max-w-7xl mx-auto">
            <StepCard
              number="01"
              icon={<Wallet className="h-8 w-8" />}
              title="Connect Wallet"
              description="Link your MetaMask wallet to get started on Sepolia testnet"
              href="/validators/models"
              color="primary"
            />
            <StepCard
              number="02"
              icon={<Vote className="h-8 w-8" />}
              title="Browse Models"
              description="Explore pending model merges and analyze their potential"
              href="/validators/models"
              color="accent"
            />
            <StepCard
              number="03"
              icon={<GitMerge className="h-8 w-8" />}
              title="Place Stakes"
              description="Stake on whether merges will improve model performance"
              href="/merge"
              color="chart-3"
            />
            <StepCard
              number="04"
              icon={<TrendingUp className="h-8 w-8" />}
              title="Earn Rewards"
              description="Win MMT tokens when your predictions are correct"
              href="/signup"
              color="chart-4"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container-responsive relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { value: "10K+", label: "Active Validators" },
              { value: "50M+", label: "MMT Distributed" },
              { value: "99.9%", label: "Uptime" },
              { value: "2.5s", label: "Avg. Reward Time" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 lg:p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group cursor-default select-none">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm lg:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Immersive Design */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1 opacity-50" />
          <div className="orb orb-2 opacity-50" />
        </div>
        
        <div className="container-responsive relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent border border-accent/20 backdrop-blur-xl mb-10 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Join 10,000+ Validators</span>
            </div>
            
            <h2 className="text-fluid-lg font-bold mb-8 tracking-tight animate-fade-in-up">
              Ready to Start Earning?
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl mb-12 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Join thousands of validators earning rewards through AI model predictions. 
              No experience needed – our platform guides you every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <Link href="/signup" className="cursor-pointer">
                <Button size="lg" className="group gradient-primary text-white hover:opacity-95 text-base sm:text-lg px-12 py-8 h-auto font-semibold shadow-xl hover:shadow-2xl rounded-2xl cursor-pointer">
                  Create Free Account
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/validators/models" className="cursor-pointer">
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-12 py-8 h-auto font-semibold border-2 border-border hover:border-primary/50 rounded-2xl bg-background/60 backdrop-blur-xl cursor-pointer">
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StepCard({ number, icon, title, description, href, color }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/20 to-primary/5 group-hover:from-primary/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    accent: "from-accent/20 to-accent/5 group-hover:from-accent/30 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
    "chart-3": "from-chart-3/20 to-chart-3/5 group-hover:from-chart-3/30 text-chart-3 group-hover:bg-chart-3 group-hover:text-white",
    "chart-4": "from-chart-4/20 to-chart-4/5 group-hover:from-chart-4/30 text-chart-4 group-hover:bg-chart-4 group-hover:text-white",
  };

  return (
    <Link href={href}>
      <div className="group card-elegant p-7 lg:p-8 text-center h-full cursor-pointer relative overflow-hidden">
        {/* Large Background Number */}
        <div className="absolute top-0 right-0 text-[100px] sm:text-[120px] font-bold text-primary/[0.03] dark:text-primary/[0.06] leading-none -mr-2 -mt-6 group-hover:text-primary/[0.08] dark:group-hover:text-primary/[0.12] transition-colors duration-500 select-none">
          {number}
        </div>
        
        <div className="relative z-10">
          <div className={`mb-6 inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${colorClasses[color]} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}>
            {icon}
          </div>
          <h3 className="text-xl lg:text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Hover Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </Link>
  );
}
