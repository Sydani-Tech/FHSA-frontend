import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publicApi, authApi } from "@/core/api/api-client";
import { useToast } from "@/hooks/use-toast";
import type { LoginData, UserCreate, User } from "@/core/lib/types";

// Note: Replicating logic mainly for service separation, 
// though implementation is currently inside AuthProvider.
// Hooks here can be used if we want to extract logic from AuthProvider.

export const authService = {
  login: (data: LoginData) => publicApi.post<User>("/login", data),
  register: (data: UserCreate) => publicApi.post<User>("/register", data),
  logout: () => authApi.post("/logout", {}),
  getCurrentUser: () => authApi.get<User>("/user"),
};
