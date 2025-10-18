
"use client";

import { createContext, useState, ReactNode, useMemo, useEffect, useContext } from "react";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        
        
        const tokenExpiry = localStorage.getItem('token_expiry');
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
          
          console.log('Token expired, clearing auth data');
          logout();
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("AuthContext: Error parsing stored user:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    setUser(null);
  };

  const isAuthenticated = useMemo(() => {
    return !!user && !!localStorage.getItem("token");
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
      isLoading,
    }),
    [user, isAuthenticated, isLoading]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400" />
        <p className="ml-4 text-lg">Loading...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};