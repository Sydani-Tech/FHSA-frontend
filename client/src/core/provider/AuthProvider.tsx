import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, publicApi } from "@/core/api/api-client";
import { queryClient } from "@/core/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, LoginData, UserCreate } from "@/core/lib/types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (data: LoginData, options?: any) => void;
  isLoggingIn: boolean;
  register: (data: UserCreate, options?: any) => void;
  isRegistering: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        return await authApi.get<User>("/user");
      } catch (err) {
        return null;
      }
    },
    retry: false,
    enabled: !!localStorage.getItem("token"),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await publicApi.post<any>("/login", credentials);
      // 'any' or 'TokenResponse' if we import it, but let's assume structure matches
      return res;
    },
    onSuccess: (data: any) => {
      // data is expected to be TokenResponse
      localStorage.setItem("token", data.access_token);
      queryClient.setQueryData(["/api/user"], data.user);
      toast({ title: "Logged in successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: UserCreate) => {
      const res = await publicApi.post<any>("/register", credentials);
      return res;
    },
    onSuccess: (data: any) => {
      // data is TokenResponse
      localStorage.setItem("token", data.access_token);
      queryClient.setQueryData(["/api/user"], data.user);
      toast({ title: "Registration successful" });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.post("/logout", {});
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear(); // Clear all cached data
      toast({ title: "Logged out successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear specific auth data
      localStorage.removeItem("token");
      queryClient.clear();
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      // Optionally force redirect if router is accessible, otherwise state change triggers it depending on route protection
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [toast, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        login: (data, options) => loginMutation.mutate(data, options),
        isLoggingIn: loginMutation.isPending,
        register: (data, options) => registerMutation.mutate(data, options),
        isRegistering: registerMutation.isPending,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
