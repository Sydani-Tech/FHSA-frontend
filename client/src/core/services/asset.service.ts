import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, publicApi } from "@/core/api/api-client";
import { useToast } from "@/hooks/use-toast";
import type { Asset, AssetCreate, AssetUpdate } from "@/core/lib/types";

// Public Assets Hook
export const useAssets = (filters?: { search?: string; type?: string }) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.type) queryParams.append("type", filters.type);

  return useQuery({
    queryKey: ["/api/assets", filters],
    queryFn: () => publicApi.get<Asset[]>(`/assets?${queryParams.toString()}`),
  });
};

// Single Asset Hook
export const useAsset = (id: number) => {
  return useQuery({
    queryKey: [`/api/assets/${id}`],
    queryFn: () => publicApi.get<Asset>(`/assets/${id}`),
    enabled: !!id,
  });
};

// Admin/Owner hooks below
export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<Asset>) => authApi.post<Asset>("/assets", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Asset created" });
    }
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Asset> & { id: number }) => 
      authApi.put<Asset>(`/assets/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: [`/api/assets/${variables.id}`] });
      toast({ title: "Asset updated" });
    }
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => authApi.delete(`/assets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Asset deleted" });
    }
  });
};
