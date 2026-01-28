import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/core/api/api-client";

export const useStats = () => {
  return useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => authApi.get<{
       users: number;
       activeAssets: number;
       pendingBookings: number;
    }>("/stats"),
  });
};
