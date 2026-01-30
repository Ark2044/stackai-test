"use client";

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BrowserProvider } from 'ethers';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  setConnecting,
  setConnected,
  setBalances,
  setChainId,
  setError,
  clearError,
  disconnectWallet,
} from '~/store/slices/walletSlice';

export function useWallet() {
  const dispatch = useAppDispatch();
  const walletState = useAppSelector((state) => state.wallet);
  const verificationAttempted = useRef(false);

  // Check on mount if we should auto-reconnect from persisted state
  useEffect(() => {
    // Prevent multiple verification attempts
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;
    
    // If wallet was persisted as connected, verify it's still valid
    if (walletState.isConnected && walletState.address) {
      // Verify the connection is still valid with MetaMask
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum
          .request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length === 0 || accounts[0] !== walletState.address) {
              // Connection is stale, disconnect
              dispatch(disconnectWallet());
              localStorage.removeItem('wallet_explicit_connect');
            } else {
              // Connection is valid, set the flag
              localStorage.setItem('wallet_explicit_connect', 'true');
            }
          })
          .catch(() => {
            // Error checking accounts, disconnect
            dispatch(disconnectWallet());
            localStorage.removeItem('wallet_explicit_connect');
          });
      }
    }
    
    // Clear any connecting state on mount
    if (walletState.isConnecting) {
      dispatch(setConnecting(false));
    }
  }, []); // Only run once on mount

  // Setup event listeners
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected in MetaMask
        dispatch(disconnectWallet());
      } else if (accounts[0] && accounts[0] !== walletState.address) {
        // User switched accounts - reconnect with new account
        connectWithAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      dispatch(setChainId(newChainId));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletState.address, dispatch]);

  const connectWithAccount = async (account: string) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      dispatch(
        setConnected({
          address: account,
          chainId: Number(network.chainId),
        })
      );

      // Note: balances are refreshed by `useContract` once it initializes.
    } catch (error) {
      console.error('Error connecting with account:', error);
    }
  };

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      dispatch(setError('MetaMask is not installed. Please install MetaMask to continue.'));
      return;
    }

    try {
      // Clear any previous errors and set connecting state
      dispatch(clearError());
      dispatch(setConnecting(true));

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      // Set flag to indicate explicit connection
      localStorage.setItem('wallet_explicit_connect', 'true');

      dispatch(
        setConnected({
          address: accounts[0],
          chainId: Number(network.chainId),
        })
      );

      // Note: balances are refreshed by `useContract` once it initializes.
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to connect to MetaMask';
      dispatch(setError(errorMessage));
      dispatch(setConnecting(false)); // Reset connecting state
      // Remove the explicit connection flag if connection failed
      localStorage.removeItem('wallet_explicit_connect');
      console.error('Connection error:', error);
    }
  }, [dispatch]);

  const disconnect = useCallback(() => {
    // Clear all wallet state
    dispatch(disconnectWallet());
    
    // Clear explicit connection flag
    localStorage.removeItem('wallet_explicit_connect');
    
    // Clear any wallet-related localStorage
    if (typeof window !== 'undefined') {
      const keysToRemove = Object.keys(localStorage).filter((key) =>
        key.startsWith('wallet_') || key.startsWith('metamask_')
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }
  }, [dispatch]);

  // Memoize formatAddress function
  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    ...walletState,
    address: walletState.address,
    account: walletState.address, // Alias for compatibility
    connect,
    disconnect,
    formatAddress,
  }), [walletState, connect, disconnect, formatAddress]);
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
