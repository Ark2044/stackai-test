"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Coins,
  TrendingUp,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  Wallet,
} from "lucide-react";
import { useContract } from "~/hooks/useContract";
import { useWallet } from "~/hooks/useWallet";
import { useAppSelector } from "~/store/hooks";
import { ethers } from "ethers";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { cn } from "~/lib/utils";
import { useModal } from "~/components/shared/animated-modal";

interface TokenStakingProps {
  mergeId?: number;
  prediction?: boolean; // true for approve, false for reject
  onSuccess?: () => void;
}

export function TokenStaking({ mergeId, prediction, onSuccess }: TokenStakingProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [txStatus, setTxStatus] = useState("");
  const [resultMessage, setResultMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { isConnected, address } = useWallet();
  const { mmtBalance, ethBalance } = useAppSelector((state) => state.wallet);
  const { contract, initializeContract, refreshBalances } = useContract();
  const { setOpen } = useModal();

  useEffect(() => {
    if (isConnected && address && !contract) {
      initializeContract().finally(() => setIsInitializing(false));
    } else if (contract) {
      setIsInitializing(false);
    }
  }, [isConnected, address, contract, initializeContract]);

  const handleStake = async () => {
    if (!mergeId || prediction === undefined) {
      setResultMessage({
        type: "error",
        message: "Invalid merge configuration",
      });
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setResultMessage({
        type: "error",
        message: "Please enter a valid amount",
      });
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(mmtBalance)) {
      setResultMessage({
        type: "error",
        message: "Insufficient MMT balance",
      });
      return;
    }

    setResultMessage(null);

    try {
      setIsProcessing(true);
      setTxStatus("Preparing transaction...");

      if (!contract) {
        throw new Error("Contract not initialized");
      }

      // Convert amount to wei
      const amountInWei = ethers.parseEther(stakeAmount);

      setTxStatus("Waiting for transaction approval...");
      
      // Call the stakeOnMerge function with correct parameters
      // prediction is already a boolean: true = "Accept", false = "Reject"
      const tx = await contract.stakeOnMerge(mergeId, amountInWei, prediction);
      
      setTxStatus("Transaction submitted. Waiting for confirmation...");
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();

      setResultMessage({
        type: "success",
        message: `Successfully placed bet! TX: ${receipt.hash.slice(0, 10)}...`,
      });
      setStakeAmount("");
      
      // Refresh balances
      await refreshBalances();
      
      // Close modal and call success callback after a short delay
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          setOpen(false);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error placing bet:", error);
      setResultMessage({
        type: "error",
        message: error.message || "Failed to place bet",
      });
    } finally {
      setIsProcessing(false);
      setTxStatus("");
    }
  };

  if (!isConnected) {
    return (
      <div className="px-6 py-12">
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/30 to-accent/30 blur-xl animate-pulse"></div>
              <div className="relative p-5 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Connect Wallet</h3>
            <p className="text-sm text-muted-foreground max-w-[220px] mx-auto">
              Connect your MetaMask wallet to start placing bets
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="px-6 py-12">
        <div className="flex flex-col items-center justify-center space-y-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/40 to-accent/40 blur-xl animate-pulse"></div>
            <div className="relative p-4 rounded-full bg-linear-to-br from-primary/15 to-accent/15 border border-primary/20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium">Initializing Contract</p>
            <p className="text-xs text-muted-foreground">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/30 bg-linear-to-r from-primary/5 via-transparent to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-primary/20 to-accent/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                Place Your Bet
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </h3>
              <p className="text-xs text-muted-foreground">
                Win 15% or lose 25%
              </p>
            </div>
          </div>
          {/* Connected Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Connected</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Prediction Badge */}
        {prediction !== undefined && (
          <div className={cn(
            "rounded-xl p-4 border",
            prediction 
              ? "bg-gradient-to-br from-emerald-500/5 to-green-500/10 border-emerald-500/30" 
              : "bg-gradient-to-br from-rose-500/5 to-red-500/10 border-rose-500/30"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                prediction ? "bg-emerald-500/20" : "bg-rose-500/20"
              )}>
                <Shield className={cn(
                  "h-4 w-4",
                  prediction ? "text-emerald-500" : "text-rose-500"
                )} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Your prediction:</p>
                <p className={cn(
                  "font-bold text-base",
                  prediction ? "text-emerald-500" : "text-rose-500"
                )}>
                  {prediction ? "✓ APPROVE" : "✗ REJECT"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3.5 bg-linear-to-br from-primary/5 to-transparent border border-border/50 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">MMT Balance</span>
              <Coins className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xl font-bold text-gradient tabular-nums">
              {parseFloat(mmtBalance).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl p-3.5 bg-linear-to-br from-accent/5 to-transparent border border-border/50 hover:border-accent/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">ETH Gas</span>
              <Zap className="h-3.5 w-3.5 text-accent" />
            </div>
            <p className="text-xl font-bold tabular-nums">
              {parseFloat(ethBalance).toFixed(4)}
            </p>
          </div>
        </div>

        {/* Stake Amount Input */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="stake-amount" className="text-sm font-semibold">
              Bet Amount
            </Label>
            <button 
              type="button"
              onClick={() => setStakeAmount(mmtBalance)}
              className="text-[10px] font-semibold text-primary hover:text-primary/80 uppercase tracking-wide transition-colors"
            >
              Max
            </button>
          </div>
          <div className="relative group">
            <Input
              id="stake-amount"
              type="number"
              placeholder="0.00"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={isProcessing}
              min="0"
              step="0.01"
              className="h-12 pl-4 pr-16 text-lg font-bold rounded-xl border-2 border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
              MMT
            </span>
          </div>
        </div>

        {/* Potential Outcomes */}
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-4 bg-linear-to-br from-emerald-500/5 to-transparent border-r border-border/50">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">If Correct</p>
              </div>
              <p className="text-2xl font-bold text-emerald-500 tabular-nums">
                +{(parseFloat(stakeAmount || "0") * 0.15).toFixed(2)}
              </p>
              <p className="text-[10px] text-emerald-500/70 mt-1">+15% reward</p>
            </div>
            <div className="p-4 bg-linear-to-br from-rose-500/5 to-transparent">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase">If Wrong</p>
              </div>
              <p className="text-2xl font-bold text-rose-500 tabular-nums">
                -{(parseFloat(stakeAmount || "0") * 0.25).toFixed(2)}
              </p>
              <p className="text-[10px] text-rose-500/70 mt-1">-25% penalty</p>
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        {txStatus && (
          <div className="rounded-xl p-3.5 bg-linear-to-r from-primary/10 to-accent/10 border border-primary/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-sm animate-pulse"></div>
                <Loader2 className="relative h-4 w-4 text-primary animate-spin" />
              </div>
              <p className="text-sm font-medium">{txStatus}</p>
            </div>
          </div>
        )}

        {/* Result Message */}
        {resultMessage && (
          <div className={cn(
            "rounded-xl p-3.5 border",
            resultMessage.type === "success" 
              ? "bg-linear-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30"
              : "bg-linear-to-r from-rose-500/10 to-red-500/10 border-rose-500/30"
          )}>
            <div className="flex items-center gap-3">
              {resultMessage.type === "success" ? (
                <div className="p-1.5 rounded-full bg-emerald-500/20">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              ) : (
                <div className="p-1.5 rounded-full bg-rose-500/20">
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                </div>
              )}
              <p className="text-sm font-medium">{resultMessage.message}</p>
            </div>
          </div>
        )}

        {/* Place Bet Button */}
        <Button
          onClick={handleStake}
          className="w-full h-12 rounded-xl bg-linear-to-r from-primary to-accent hover:opacity-90 text-white font-bold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={!stakeAmount || isProcessing || parseFloat(stakeAmount) <= 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Place Bet
            </>
          )}
        </Button>

        {/* Notice */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Bets locked until merge finalization (100 votes)</span>
        </div>
      </div>
    </div>
  );
}
