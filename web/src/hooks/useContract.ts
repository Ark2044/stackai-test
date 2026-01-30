"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import { ModelMergeStakingABI, getContractConfig } from "~/contracts/config";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setBalances, setError as setWalletError } from "~/store/slices/walletSlice";

interface ContractState {
  contract: Contract | null;
  provider: BrowserProvider | null;
  signer: ethers.Signer | null;
  isLoading: boolean;
  error: string | null;
}

export function useContract() {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAppSelector((state) => state.wallet);
  
  const [state, setState] = useState<ContractState>({
    contract: null,
    provider: null,
    signer: null,
    isLoading: false,
    error: null,
  });

  const initializeContract = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask not installed",
      }));
      return;
    }

    if (!isConnected || !address) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const config = getContractConfig();

      // Validate network
      if (Number(network.chainId) !== config.chainId) {
        const errorMsg = `Wrong network. Please switch to Sepolia (Chain ID: ${config.chainId})`;
        setState({
          contract: null,
          provider: null,
          signer: null,
          isLoading: false,
          error: errorMsg,
        });
        dispatch(setWalletError(errorMsg));
        return;
      }

      const signer = await provider.getSigner();

      const contract = new Contract(
        config.contractAddress,
        ModelMergeStakingABI,
        signer
      );

      setState({
        contract,
        provider,
        signer,
        isLoading: false,
        error: null,
      });

      // Load balances
      await loadBalances(contract, signer);
    } catch (error: any) {
      console.error("Contract initialization error:", error);
      setState({
        contract: null,
        provider: null,
        signer: null,
        isLoading: false,
        error: error.message || "Failed to initialize contract",
      });
    }
  }, [address, isConnected, dispatch]);

  // Auto-initialize when wallet becomes connected.
  useEffect(() => {
    if (isConnected && address) {
      void initializeContract();
    } else {
      // If disconnected, clear local contract state.
      setState({
        contract: null,
        provider: null,
        signer: null,
        isLoading: false,
        error: null,
      });
    }
  }, [isConnected, address, initializeContract]);

  const loadBalances = async (contract: Contract, signer: ethers.Signer) => {
    try {
      const userAddress = await signer.getAddress();
      const provider = contract.runner?.provider as BrowserProvider;

      let mmtBalance = "0";
      let ethBalance = "0";

      // Try to get MMT token balance
      try {
        if (contract.balanceOf) {
          const balance = await contract.balanceOf(userAddress);
          mmtBalance = ethers.formatEther(balance);
        }
      } catch (error: any) {
        console.warn("Could not fetch MMT balance:", error.message);
        // If contract not deployed or wrong network, default to 0
        mmtBalance = "0";
      }

      // Get ETH balance (this should always work)
      try {
        const balance = await provider.getBalance(userAddress);
        ethBalance = ethers.formatEther(balance);
      } catch (error) {
        console.error("Error loading ETH balance:", error);
        ethBalance = "0";
      }

      // Update Redux store
      dispatch(setBalances({
        eth: ethBalance,
        mmt: mmtBalance,
      }));
    } catch (error) {
      console.error("Error loading balances:", error);
      dispatch(setBalances({
        eth: "0",
        mmt: "0",
      }));
    }
  };

  const refreshBalances = useCallback(async () => {
    if (state.contract && state.signer) {
      await loadBalances(state.contract, state.signer);
    }
  }, [state.contract, state.signer, dispatch]);

  return {
    ...state,
    initializeContract,
    refreshBalances,
  };
}
