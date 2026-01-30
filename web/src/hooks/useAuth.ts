"use client";

import { useCallback, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setUser, logout as logoutAction, setLoading } from '~/store/slices/authSlice';
import { disconnectWallet } from '~/store/slices/walletSlice';
import { clearPersistedState } from '~/store';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const authState = useAppSelector((state) => state.auth);

  // Sync NextAuth session with Redux
  useEffect(() => {
    if (status === 'loading') {
      dispatch(setLoading(true));
      return;
    }

    if (status === 'authenticated' && session?.user) {
      dispatch(
        setUser({
          id: session.user.id ?? '',
          email: session.user.email ?? '',
          name: session.user.name ?? null,
        })
      );
    } else if (status === 'unauthenticated') {
      dispatch(setLoading(false));
      dispatch(logoutAction());
    }
  }, [session, status, dispatch]);

  const logout = useCallback(async () => {
    try {
      // 1. Clear NextAuth session first (clears server-side session and cookies)
      await signOut({ redirect: false });
      
      // 2. Clear Redux auth state
      dispatch(logoutAction());
      
      // 3. Disconnect wallet (clears wallet state in Redux)
      dispatch(disconnectWallet());
      
      // 4. Clear all persisted Redux data (localStorage)
      await clearPersistedState();
      
      // 5. Clear all browser storage comprehensively
      if (typeof window !== 'undefined') {
        // Clear explicit wallet connection flag
        localStorage.removeItem('wallet_explicit_connect');
        
        // Clear all NextAuth related items
        const allKeys = Object.keys(localStorage);
        allKeys.forEach((key) => {
          if (
            key.startsWith('wallet_') || 
            key.startsWith('user_') ||
            key.startsWith('next-auth') ||
            key.startsWith('__Secure-') ||
            key.includes('session') ||
            key.includes('token')
          ) {
            localStorage.removeItem(key);
          }
        });
        
        // Clear sessionStorage completely
        sessionStorage.clear();
        
        // Clear all cookies
        document.cookie.split(";").forEach((cookie) => {
          const name = cookie.split("=")[0]?.trim();
          if (name) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          }
        });
      }
      
      // 6. Redirect to home page
      router.push('/');
      
      // 7. Force reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still redirect
      router.push('/');
    }
  }, [dispatch, router]);

  return {
    ...authState,
    logout,
  };
}
