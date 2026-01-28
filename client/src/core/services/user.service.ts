import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/core/api/api-client";
import { useToast } from "@/hooks/use-toast";
import type { User, UserUpdate } from "@/core/lib/types";

export const useUsers = () => {
  return useQuery({
    queryKey: ["/api/users"],
    queryFn: () => authApi.get<User[]>("/users"),
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ["/api/users", id],
    queryFn: () => authApi.get<User>(`/users/${id}`),
    enabled: !!id,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      authApi.patch(`/users/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "User status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating user", description: error.message, variant: "destructive" });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => authApi.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "User deleted" });
    },
  });
};
