"use client";
import React, { useEffect, useState, useContext, createContext } from "react";
import { getUser } from "~/app/api/manageUser";
import { type User } from "@prisma/client";
import { useSession } from "next-auth/react";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const findUser = async () => {
      try {
        const u = await getUser(session?.user.email as string);
        setUser(u);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    if (status === "authenticated" && session?.user?.email) {
      findUser();
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [status, session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
