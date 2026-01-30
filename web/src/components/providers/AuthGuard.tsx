"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '~/store/hooks';

// Pages that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/validators/models',
  '/repo',
];

// Pages that should redirect to dashboard if already authenticated
const AUTH_ONLY_ROUTES = ['/login', '/signup'];

// Pages accessible to everyone
const PUBLIC_ROUTES = ['/', '/auth/cli'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only enforce routing after initial load
    if (isLoading) return;

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAuthOnly = AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtected && !isAuthenticated) {
      // Redirect to login if trying to access protected route without auth
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (isAuthOnly && isAuthenticated) {
      // Redirect to dashboard if trying to access login/signup while authenticated
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Don't block rendering, just show content
  // The useEffect above will handle redirects if needed
  return <>{children}</>;
}
