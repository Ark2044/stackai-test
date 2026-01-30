"use client";

import { BettingDashboard } from "~/components/betting/betting-dashboard";
import { TransactionHistory } from "~/components/betting/transaction-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useWallet } from "~/hooks/useWallet";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Wallet, TrendingUp, Activity, Award, Sparkles, ArrowRight, BarChart3, History, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

// Client-side rendered - needs wallet connection
export default function DashboardPage() {
  const { address } = useWallet();

  if (!address) {
    return (
      <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1 opacity-60" />
          <div className="orb orb-2 opacity-60" />
        </div>
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <div className="max-w-lg w-full mx-auto relative z-10">
          <div className="card-glass p-10 sm:p-14 text-center animate-fade-in-up">
            {/* Animated Icon */}
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping opacity-30" />
              </div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 group hover:scale-110 transition-all duration-500">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">
              Connect Your <span className="text-gradient">Wallet</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
              Please connect your MetaMask wallet to access your dashboard and start earning rewards.
            </p>
            
            <Link href="/validators/models">
              <Button size="lg" className="group gradient-primary text-white hover:opacity-95 shadow-xl hover:shadow-2xl px-10 py-7 h-auto rounded-2xl text-base font-semibold">
                Connect Wallet
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            
            {/* Trust indicators */}
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
                <span>Secure Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Sepolia Testnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 opacity-40" />
        <div className="orb orb-2 opacity-40" />
        <div className="orb orb-3 opacity-30" />
      </div>
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      <div className="container-responsive py-8 sm:py-10 space-y-8 sm:space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 mb-5">
              <Sparkles className="h-4 w-4" />
              <span>Your Dashboard</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-gradient">Betting Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl">
              Track your staking activity, monitor rewards, and analyze your performance in real-time.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="group h-12 px-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              <Activity className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              Activity Log
            </Button>
            <Link href="/validators/models">
              <Button className="group gradient-primary text-white hover:opacity-95 h-12 px-6 shadow-lg hover:shadow-xl rounded-xl transition-all duration-300">
                <Award className="mr-2 h-4 w-4" />
                Browse Models
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <TabsList className="grid w-full max-w-md grid-cols-2 h-14 p-1.5 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger 
              value="overview" 
              className="cursor-pointer rounded-lg h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="cursor-pointer rounded-lg h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <History className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            <BettingDashboard />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8 animate-fade-in">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {[
            { icon: Zap, title: "Quick Stake", desc: "Place a new stake", href: "/validators/models", color: "primary" },
            { icon: TrendingUp, title: "Analytics", desc: "View detailed stats", href: "/dashboard", color: "accent" },
            { icon: Award, title: "Rewards", desc: "Claim your rewards", href: "/dashboard", color: "chart-3" },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <div className="group card-elegant p-6 cursor-pointer h-full">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-${action.color}/10 group-hover:bg-${action.color}/20 transition-all duration-300 group-hover:scale-110`}>
                    <action.icon className={`h-6 w-6 text-${action.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
