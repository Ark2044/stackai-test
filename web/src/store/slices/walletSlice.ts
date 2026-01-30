import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  ethBalance: string;
  mmtBalance: string;
  chainId: number | null;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  ethBalance: '0',
  mmtBalance: '0',
  chainId: null,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setConnected: (state, action: PayloadAction<{ address: string; chainId: number }>) => {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
    },
    setBalances: (state, action: PayloadAction<{ eth: string; mmt: string }>) => {
      state.ethBalance = action.payload.eth;
      state.mmtBalance = action.payload.mmt;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    disconnectWallet: (state) => {
      // Complete reset to initial state
      return initialState;
    },
  },
});

export const {
  setConnecting,
  setConnected,
  setBalances,
  setChainId,
  setError,
  clearError,
  disconnectWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
