"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '~/store/hooks';

// Pages that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/validators/models',
  '/repo',
  '/merge',
  '/profile',
];

// Pages accessible to everyone
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/auth/cli'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only enforce routing after initial load
    if (isLoading) return;

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));

    // Only redirect if trying to access a protected route without authentication
    if (isProtected && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    // Don't redirect authenticated users away from login/signup - let them see the pages
  }, [isAuthenticated, isLoading, pathname, router]);

  // Don't block rendering, just show content
  // The useEffect above will handle redirects if needed
  return <>{children}</>;
}
