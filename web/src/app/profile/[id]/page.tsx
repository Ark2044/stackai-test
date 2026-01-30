"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAuth } from "~/hooks/useAuth";
import { useWallet } from "~/hooks/useWallet";
import { useAppSelector } from "~/store/hooks";
import { cn } from "~/lib/utils";
import {
  User,
  Mail,
  Wallet,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Coins,
  Activity,
  Settings,
  Shield,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Edit3,
  Save,
  Calendar,
  Award,
  Target,
  Zap,
  BarChart3,
  History,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user } = useAuth();
  const { address, isConnected } = useWallet();
  const { mmtBalance, ethBalance } = useAppSelector((state) => state.wallet);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwnProfile = user?.id === userId;

  // Mock user stats - in production these would come from API/blockchain
  const userStats = {
    totalStaked: "2,450.00",
    totalRewards: "367.50",
    winRate: "73%",
    totalVotes: 156,
    correctPredictions: 114,
    incorrectPredictions: 42,
    memberSince: "2025-06-15",
    rank: "Gold Validator",
  };

  const recentActivity = [
    { type: "stake", model: "GPT-Vision-Pro", amount: "50.00", prediction: true, result: "pending", date: "2 hours ago" },
    { type: "reward", model: "BERT-NLP-Enhanced", amount: "+7.50", prediction: true, result: "won", date: "1 day ago" },
    { type: "penalty", model: "ResNet-Vision-Ultra", amount: "-12.50", prediction: false, result: "lost", date: "3 days ago" },
    { type: "stake", model: "Whisper-Audio-Pro", amount: "100.00", prediction: true, result: "won", date: "5 days ago" },
  ];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-primary/20 -top-40 -left-40"></div>
        <div className="orb w-[500px] h-[500px] bg-accent/15 top-1/3 -right-32 animation-delay-2000"></div>
        <div className="orb w-[400px] h-[400px] bg-primary/10 bottom-20 left-1/4 animation-delay-4000"></div>
      </div>
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 dot-pattern pointer-events-none"></div>

      <div className="relative z-10 container-responsive py-12">
        {/* Profile Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="card-glass rounded-2xl overflow-hidden">
            {/* Cover Gradient */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-primary via-accent to-primary relative">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
            </div>

            {/* Profile Info */}
            <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-20">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-primary to-accent p-1">
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                    </div>
                  </div>
                  {isOwnProfile && (
                    <button className="absolute bottom-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-primary/10 transition-colors">
                      <Edit3 className="w-4 h-4 text-primary" />
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold">{user?.name || "Anonymous User"}</h1>
                    <Badge className="w-fit bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30">
                      <Award className="w-3 h-3 mr-1" />
                      {userStats.rank}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {user?.email && (
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(userStats.memberSince).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {isOwnProfile && (
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        {isConnected && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="rounded-xl p-5 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20">
                    <Wallet className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Connected Wallet</p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">
                        {address?.slice(0, 10)}...{address?.slice(-8)}
                      </code>
                      <button
                        onClick={copyAddress}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <a
                        href={`https://sepolia.etherscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">MMT Balance</p>
                    <p className="text-lg font-bold text-emerald-500">{parseFloat(mmtBalance).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">ETH Balance</p>
                    <p className="text-lg font-bold">{parseFloat(ethBalance).toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {[
            { label: "Total Staked", value: userStats.totalStaked, icon: Coins, color: "cyan", gradient: "from-cyan-500/10 to-teal-500/10", border: "border-cyan-500/30" },
            { label: "Total Rewards", value: userStats.totalRewards, icon: Trophy, color: "emerald", gradient: "from-emerald-500/10 to-green-500/10", border: "border-emerald-500/30" },
            { label: "Win Rate", value: userStats.winRate, icon: Target, color: "violet", gradient: "from-violet-500/10 to-purple-500/10", border: "border-violet-500/30" },
            { label: "Total Votes", value: userStats.totalVotes.toString(), icon: Activity, color: "amber", gradient: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/30" },
          ].map((stat, i) => (
            <div key={i} className={cn("card-glass rounded-2xl p-5 relative overflow-hidden", stat.border)}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", stat.gradient)} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className={cn("p-2 rounded-lg", `bg-${stat.color}-500/20`)}>
                    <stat.icon className={cn("w-4 h-4", `text-${stat.color}-500`)} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="activity" className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <TabsList className="grid w-full max-w-md grid-cols-3 h-14 p-1.5 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 mb-8">
            <TabsTrigger
              value="activity"
              className="rounded-lg h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <History className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-lg h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="rounded-lg h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Award className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Recent Activity
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Your latest staking activity and results</p>
              </div>
              <div className="p-6 space-y-4">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md",
                      activity.result === "won" && "border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-green-500/5",
                      activity.result === "lost" && "border-rose-500/30 bg-gradient-to-r from-rose-500/5 to-red-500/5",
                      activity.result === "pending" && "border-border/50 bg-muted/20"
                    )}
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className={cn(
                        "p-2.5 rounded-xl",
                        activity.result === "won" && "bg-emerald-500/20",
                        activity.result === "lost" && "bg-rose-500/20",
                        activity.result === "pending" && "bg-primary/20"
                      )}>
                        {activity.result === "won" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        {activity.result === "lost" && <XCircle className="w-5 h-5 text-rose-500" />}
                        {activity.result === "pending" && <Clock className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{activity.model}</span>
                          <Badge className={cn(
                            "text-xs",
                            activity.prediction
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}>
                            {activity.prediction ? "Approve" : "Reject"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-lg font-bold",
                        activity.amount.startsWith("+") && "text-emerald-500",
                        activity.amount.startsWith("-") && "text-rose-500"
                      )}>
                        {activity.amount} MMT
                      </p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {activity.result}
                      </Badge>
                    </div>
                  </div>
                ))}

                <Link href="/dashboard">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 mt-4">
                    View All Transactions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Statistics
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Detailed breakdown of your validation performance</p>
              </div>
              <div className="p-6">
                {/* Win/Loss Breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl p-5 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">Correct Predictions</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-500">{userStats.correctPredictions}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {((userStats.correctPredictions / userStats.totalVotes) * 100).toFixed(1)}% success rate
                    </p>
                  </div>
                  <div className="rounded-xl p-5 bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <XCircle className="w-5 h-5 text-rose-500" />
                      <span className="font-medium text-rose-600 dark:text-rose-400">Incorrect Predictions</span>
                    </div>
                    <p className="text-3xl font-bold text-rose-500">{userStats.incorrectPredictions}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {((userStats.incorrectPredictions / userStats.totalVotes) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="rounded-xl p-5 bg-muted/20 border border-border/50">
                  <div className="flex justify-between mb-3">
                    <span className="font-medium">Win Rate Progress</span>
                    <span className="font-bold text-primary">{userStats.winRate}</span>
                  </div>
                  <div className="h-4 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: userStats.winRate }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Maintain above 70% to keep Gold Validator status
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Achievements & Badges
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Milestones you've reached as a validator</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { name: "First Stake", desc: "Placed your first stake", icon: Zap, color: "cyan", unlocked: true },
                    { name: "10 Votes", desc: "Cast 10 validation votes", icon: Activity, color: "violet", unlocked: true },
                    { name: "50 Correct", desc: "50 correct predictions", icon: Target, color: "emerald", unlocked: true },
                    { name: "100 Votes", desc: "Cast 100 validation votes", icon: Award, color: "amber", unlocked: true },
                    { name: "Gold Rank", desc: "Achieved Gold Validator", icon: Trophy, color: "amber", unlocked: true },
                    { name: "Streak 10", desc: "10 wins in a row", icon: TrendingUp, color: "rose", unlocked: false },
                    { name: "1K Staked", desc: "Staked 1,000 MMT total", icon: Coins, color: "cyan", unlocked: true },
                    { name: "Top 10%", desc: "Top 10% of validators", icon: Shield, color: "violet", unlocked: false },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-xl p-4 border text-center transition-all duration-300",
                        badge.unlocked
                          ? "card-glass hover:shadow-lg"
                          : "bg-muted/20 border-border/30 opacity-50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3",
                        badge.unlocked ? `bg-${badge.color}-500/20` : "bg-muted/50"
                      )}>
                        <badge.icon className={cn(
                          "w-6 h-6",
                          badge.unlocked ? `text-${badge.color}-500` : "text-muted-foreground"
                        )} />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.desc}</p>
                      {!badge.unlocked && (
                        <Badge variant="outline" className="mt-2 text-xs">Locked</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
