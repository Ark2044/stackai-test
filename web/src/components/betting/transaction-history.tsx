"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  History,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useContract } from "~/hooks/useContract";
import { useWallet } from "~/hooks/useWallet";
import { getContractConfig } from "~/contracts/config";
import { cn } from "~/lib/utils";

interface Transaction {
  hash: string;
  type: "stake" | "reward" | "penalty";
  amount: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  mergeId?: number;
  prediction?: boolean;
}

export function TransactionHistory() {
  const { address } = useWallet();
  const { contract } = useContract();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const config = getContractConfig();

  const loadTransactions = useCallback(async () => {
    if (!contract || !address) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Listen to past events
      const filter = contract.filters?.ModelStaked?.(address);
      if (!filter) {
        setIsLoading(false);
        return;
      }
      
      const events = await contract.queryFilter(filter, -10000); // Last ~10k blocks

      const txs: Transaction[] = await Promise.all(
        events.map(async (event) => {
          const block = await event.getBlock();
          const eventLog = event as any; // Type assertion for event args
          return {
            hash: event.transactionHash,
            type: "stake" as const,
            amount: eventLog.args?.amount?.toString() || "0",
            timestamp: block.timestamp,
            status: "confirmed" as const,
            mergeId: eventLog.args?.mergeId?.toString(),
            prediction: eventLog.args?.claim,
          };
        })
      );

      setTransactions(txs.reverse()); // Most recent first
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contract, address]);

  useEffect(() => {
    if (contract && address) {
      loadTransactions();
    } else {
      setIsLoading(false);
    }
  }, [contract, address, loadTransactions]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stake":
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case "reward":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "penalty":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAmount = (amount: string) => {
    try {
      const eth = parseFloat(amount) / 1e18;
      return eth.toFixed(4);
    } catch {
      return "0";
    }
  };

  // Use conditional rendering instead of early return to avoid hooks issues
  const renderContent = () => {
    if (!address) {
      return (
        <div className="card-glass rounded-2xl p-8 text-center">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
          <p className="text-muted-foreground">
            Connect your wallet to view transaction history
          </p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="card-glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Transaction History</h3>
                <p className="text-sm text-muted-foreground">
                  Your staking and reward transactions
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping opacity-30" />
                </div>
                <Loader2 className="relative h-10 w-10 animate-spin text-primary" />
              </div>
              <span className="mt-6 text-muted-foreground font-medium">Loading transactions...</span>
            </div>
          </div>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="card-glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Transaction History</h3>
                <p className="text-sm text-muted-foreground">
                  Your staking and reward transactions
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-muted/50 mb-6">
                <Clock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
              <p className="text-muted-foreground max-w-sm">
                No transactions found. Place your first stake to get started and see your history here!
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Start by browsing available models</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card-glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Transaction History</h3>
                <p className="text-sm text-muted-foreground">
                  Your staking and reward transactions
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadTransactions} 
              disabled={isLoading}
              className="group rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className={cn(
                  "group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
                  "hover:border-primary/30 hover:bg-card/80 hover:shadow-lg"
                )}
              >
                {/* Left side - Transaction Info */}
                <div className="flex items-start gap-4 flex-1 mb-3 sm:mb-0">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-110",
                    tx.type === "stake" && "bg-gradient-to-br from-primary/20 to-accent/20",
                    tx.type === "reward" && "bg-gradient-to-br from-emerald-500/20 to-green-500/20",
                    tx.type === "penalty" && "bg-gradient-to-br from-rose-500/20 to-red-500/20"
                  )}>
                    {getTypeIcon(tx.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold capitalize">{tx.type}</span>
                      {tx.mergeId && (
                        <Badge variant="outline" className="text-xs rounded-lg bg-muted/50">
                          Merge #{tx.mergeId}
                        </Badge>
                      )}
                      {tx.prediction !== undefined && (
                        <Badge
                          className={cn(
                            "text-xs rounded-lg",
                            tx.prediction 
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}
                        >
                          {tx.prediction ? "Approve" : "Reject"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono truncate">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </span>
                      <a
                        href={`${config.blockExplorer}/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>
                </div>
                
                {/* Right side - Status and Amount */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                  {getStatusBadge(tx.status)}
                  <span className="text-lg font-bold text-gradient">
                    {formatAmount(tx.amount)} MMT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
}
