"use client";
import React, { useEffect, useState, useContext, createContext, useMemo } from "react";
import { useSession } from "next-auth/react";

type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

interface UserContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isLoading: boolean;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "authenticated" && session?.user?.id && session.user.email) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
      });
      setIsLoading(false);
      return;
    }

    setUser(null);
    setIsLoading(false);
  }, [status, session?.user?.id, session?.user?.email, session?.user?.name]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ user, setUser, isLoading }), [user, isLoading]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
