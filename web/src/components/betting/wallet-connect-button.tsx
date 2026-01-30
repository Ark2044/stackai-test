"use client";

import { memo, useEffect, useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Wallet, Coins, AlertCircle } from "lucide-react";
import { useWallet } from "~/hooks/useWallet";
import { useContract } from "~/hooks/useContract";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const WalletConnectButton = memo(function WalletConnectButton() {
  const { address, isConnected, isConnecting, error, ethBalance, mmtBalance, connect, disconnect, formatAddress } = useWallet();
  const { contract, initializeContract } = useContract();
  const [showError, setShowError] = useState(false);

  // Initialize contract when wallet connects or when rehydrated from storage
  useEffect(() => {
    if (isConnected && address && !contract) {
      initializeContract();
    }
  }, [isConnected, address, contract, initializeContract]);

  // Show error temporarily
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleConnect = useCallback(() => {
    connect();
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  if (error && showError) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error.includes("MetaMask") ? "Install MetaMask" : "Connection Failed"}
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleConnect}
          className="flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden md:inline">{formatAddress(address)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2 space-y-2">
            <div className="font-mono text-xs break-all text-muted-foreground">
              {address}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Wallet className="h-3 w-3" />
                  ETH Balance:
                </span>
                <span className="font-medium">{parseFloat(ethBalance).toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  MMT Balance:
                </span>
                <span className="font-medium">{parseFloat(mmtBalance).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect}>
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2"
      title="Connect your MetaMask wallet to place bets"
    >
      <Wallet className={`h-4 w-4 ${isConnecting ? 'animate-pulse' : ''}`} />
      <span className="hidden md:inline">
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </span>
    </Button>
  );
});
