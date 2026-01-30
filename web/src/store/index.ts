import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import authReducer from './slices/authSlice';
import walletReducer from './slices/walletSlice';

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage on client, noop on server
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};

// Persist config for wallet
const walletPersistConfig = {
  key: 'wallet',
  storage,
  whitelist: ['address', 'isConnected', 'ethBalance', 'mmtBalance', 'chainId'], // Persist wallet state
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  wallet: persistReducer(walletPersistConfig, walletReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Clear all persisted data (for logout)
export const clearPersistedState = async () => {
  await persistor.purge();
  await storage.removeItem('persist:auth');
  await storage.removeItem('persist:wallet');
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
