"use client";

import { useState, useEffect, useMemo, memo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Coins, TrendingUp, Users, Trophy, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useContract } from "~/hooks/useContract";
import { useWallet } from "~/hooks/useWallet";
import { useAppSelector } from "~/store/hooks";
import { cn } from "~/lib/utils";
import { LoadingSpinner, Skeleton } from "~/components/ui/loading-spinner";

export function BettingDashboard() {
  const { address } = useWallet();
  const { mmtBalance, ethBalance } = useAppSelector((state) => state.wallet);
  const { contract, error: contractError, isLoading: contractIsLoading } = useContract();
  const [rewards, setRewards] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const withTimeout = useCallback(async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Request timed out")), ms);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, []);

  const loadStats = useCallback(async () => {
    if (!address || !contract) {
      setIsLoading(false);
      setStatsError(null);
      return;
    }

    try {
      setIsLoading(true);
      setStatsError(null);

      // Solidity public mapping getter: `validatorRewards(address) returns (int256)`
      if (typeof (contract as any).validatorRewards === "function") {
        const userRewards = await withTimeout((contract as any).validatorRewards(address), 10_000);
        setRewards(userRewards?.toString?.() ?? String(userRewards));
      } else {
        setRewards("0");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load stats";
      setStatsError(message);
      setRewards("0");
    } finally {
      setIsLoading(false);
    }
  }, [address, contract, withTimeout]);

  useEffect(() => {
    if (contract && address) void loadStats();
  }, [contract, address, loadStats]);

  // Memoize stats array to prevent re-computation
  const stats = useMemo(() => [
    {
      title: "MMT Balance",
      value: parseFloat(mmtBalance).toFixed(2),
      subtitle: "Available to stake",
      icon: Coins,
      trend: "+12.5%",
      trendUp: true,
      gradient: "from-cyan-500/10 to-teal-500/10",
      iconBg: "from-cyan-500/20 to-teal-500/20",
      accentColor: "cyan-500",
      borderColor: "border-cyan-500/30",
    },
    {
      title: "Total Rewards",
      value: parseFloat(rewards).toFixed(2),
      subtitle: "Net earnings",
      icon: Trophy,
      trend: parseFloat(rewards) >= 0 ? "+8.2%" : "-3.1%",
      trendUp: parseFloat(rewards) >= 0,
      gradient: parseFloat(rewards) >= 0 ? "from-emerald-500/10 to-green-500/10" : "from-rose-500/10 to-red-500/10",
      iconBg: parseFloat(rewards) >= 0 ? "from-emerald-500/20 to-green-500/20" : "from-rose-500/20 to-red-500/20",
      accentColor: parseFloat(rewards) >= 0 ? "emerald-500" : "rose-500",
      borderColor: parseFloat(rewards) >= 0 ? "border-emerald-500/30" : "border-rose-500/30",
    },
    {
      title: "ETH Balance",
      value: parseFloat(ethBalance).toFixed(4),
      subtitle: "For gas fees",
      icon: TrendingUp,
      trend: "-0.8%",
      trendUp: false,
      gradient: "from-violet-500/10 to-purple-500/10",
      iconBg: "from-violet-500/20 to-purple-500/20",
      accentColor: "violet-500",
      borderColor: "border-violet-500/30",
    },
    {
      title: "Status",
      value: "Active",
      subtitle: "Validator",
      icon: Users,
      trend: "Online",
      trendUp: true,
      gradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "from-amber-500/20 to-orange-500/20",
      accentColor: "amber-500",
      borderColor: "border-amber-500/30",
    },
  ], [mmtBalance, rewards, ethBalance]);

  // Don't render if no address (parent should handle this, but just in case)
  if (!address) {
    return (
      <div className="card-glass rounded-2xl p-6">
        <div className="text-sm text-muted-foreground">Wallet not connected</div>
      </div>
    );
  }

  if (contractError) {
    return (
      <div className="card-glass rounded-2xl p-6">
        <div className="text-sm font-medium mb-2">Contract error</div>
        <div className="text-sm text-muted-foreground">{contractError}</div>
      </div>
    );
  }

  if (contractIsLoading) {
    return (
      <div className="card-glass rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <LoadingSpinner className="h-5 w-5" />
          <div className="text-sm text-muted-foreground">Initializing contract…</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-28 mb-3 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="card-glass rounded-2xl p-6">
        <div className="text-sm font-medium mb-2">Stats unavailable</div>
        <div className="text-sm text-muted-foreground">{statsError}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className={cn(
              "group relative overflow-hidden rounded-2xl card-glass hover:shadow-xl transition-all duration-300",
              stat.borderColor
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 bg-linear-to-br opacity-60",
              stat.gradient
            )} />
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1.5 tracking-tight">
                    {stat.title}
                  </p>
                  {/* Trend Badge */}
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium",
                    stat.trendUp 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-rose-500/10 text-rose-500"
                  )}>
                    {stat.trendUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                
                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br transition-all duration-300 group-hover:scale-110",
                  stat.iconBg
                )}>
                  <Icon className={cn("h-6 w-6", `text-${stat.accentColor}`)} />
                </div>
              </div>
              
              {/* Value */}
              <div className="text-3xl font-bold mb-2 tracking-tight">
                {stat.value}
              </div>
              
              {/* Subtitle */}
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-primary opacity-60" />
                {stat.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
