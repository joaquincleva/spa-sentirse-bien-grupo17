"use client";
import { User } from "@/interfaces/User.interface";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, [setAuthUser]);
  return (
    <UserContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usando dentro de authUserProvider");
  }
  return context;
};
