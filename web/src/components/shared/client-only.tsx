"use client";

import { useEffect, useState } from "react";
import { PageLoading } from "~/components/ui/loading-spinner";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component to handle client-only rendering with loading state
 * Prevents hydration mismatches for components that use browser APIs
 */
export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback || <PageLoading text="Loading..." />;
  }

  return <>{children}</>;
}
