import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/core/api/api-client";

// Define generic Stats type if not imported
interface Stats {
  users: number;
  activeAssets: number;
  pendingRequests: number;
}

export function useStats() {
  return useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => authApi.get<Stats>("/stats"),
  });
}

export interface UserDashboardStats {
  total_bookings: number;
  pending_bookings: number;
  active_bookings: number;
  completed_bookings: number;
}

export function useUserDashboardStats() {
  return useQuery({
    queryKey: ["/api/dashboard/user"],
    queryFn: () => authApi.get<UserDashboardStats>("/user/dashboard"),
  });
}

export interface AdminDashboardStats {
  total_users: number;
  active_assets: number;
  pending_requests: number;
  assets_in_possession: number;
  completed_requests: number;
  total_requests: number;
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["/api/admin/dashboard-stats"],
    queryFn: () => authApi.get<AdminDashboardStats>("/admin/dashboard-stats"),
  });
}
