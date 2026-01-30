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
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
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
      <div className="card-glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Place Your Bet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to place a bet on this merge prediction
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Please connect your MetaMask wallet to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="card-glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h3 className="font-semibold text-lg">Place Your Bet</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-md animate-pulse"></div>
              <Loader2 className="relative h-10 w-10 text-primary animate-spin" />
            </div>
            <p className="mt-4 text-muted-foreground">Initializing contract...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Place Your Bet
              <Sparkles className="h-4 w-4 text-accent" />
            </h3>
            <p className="text-sm text-muted-foreground">
              Stake MMT tokens on your prediction. Win 15% or lose 25%.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Prediction Badge */}
        {prediction !== undefined && (
          <div className={cn(
            "rounded-xl p-4 border",
            prediction 
              ? "bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30" 
              : "bg-gradient-to-r from-rose-500/10 to-red-500/10 border-rose-500/30"
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
                <p className="text-sm text-muted-foreground">You are betting on:</p>
                <p className={cn(
                  "font-bold text-lg",
                  prediction ? "text-emerald-500" : "text-rose-500"
                )}>
                  {prediction ? "✓ APPROVE" : "✗ REJECT"} this merge
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Balance Display */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-elegant rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">MMT Balance</span>
            </div>
            <p className="text-lg font-bold text-gradient">
              {parseFloat(mmtBalance).toFixed(2)}
            </p>
          </div>
          <div className="card-elegant rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">ETH for Gas</span>
            </div>
            <p className="text-lg font-bold">
              {parseFloat(ethBalance).toFixed(4)}
            </p>
          </div>
        </div>

        {/* Stake Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="stake-amount" className="text-sm font-medium">
            Bet Amount (MMT)
          </Label>
          <div className="relative">
            <Input
              id="stake-amount"
              type="number"
              placeholder="Enter amount..."
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={isProcessing}
              min="0"
              step="0.01"
              className="h-12 pl-4 pr-16 rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
              MMT
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum: 0.01 MMT
          </p>
        </div>

        {/* Rewards/Penalties Info */}
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-border/50">
            <div className="p-4 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
              <p className="text-xs text-muted-foreground mb-1">If you win</p>
              <p className="text-lg font-bold text-emerald-500">
                +{(parseFloat(stakeAmount || "0") * 0.15).toFixed(2)} MMT
              </p>
              <p className="text-xs text-emerald-500/70">+15% reward</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-rose-500/5 to-red-500/5">
              <p className="text-xs text-muted-foreground mb-1">If you lose</p>
              <p className="text-lg font-bold text-rose-500">
                -{(parseFloat(stakeAmount || "0") * 0.25).toFixed(2)} MMT
              </p>
              <p className="text-xs text-rose-500/70">-25% penalty</p>
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        {txStatus && (
          <div className="rounded-xl p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <p className="text-sm font-medium">{txStatus}</p>
            </div>
          </div>
        )}

        {/* Result Message */}
        {resultMessage && (
          <div className={cn(
            "rounded-xl p-4 border",
            resultMessage.type === "success" 
              ? "bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30"
              : "bg-gradient-to-r from-rose-500/10 to-red-500/10 border-rose-500/30"
          )}>
            <div className="flex items-center gap-3">
              {resultMessage.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-500" />
              )}
              <p className="text-sm font-medium">{resultMessage.message}</p>
            </div>
          </div>
        )}

        {/* Place Bet Button */}
        <Button
          onClick={handleStake}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/25 transition-all duration-300"
          disabled={!stakeAmount || isProcessing || parseFloat(stakeAmount) <= 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-5 w-5" />
              Place Bet
            </>
          )}
        </Button>

        {/* Important Notice */}
        <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/30">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <strong>Important:</strong> Once you place a bet, it cannot be withdrawn until the merge is finalized (100 validator votes required).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
