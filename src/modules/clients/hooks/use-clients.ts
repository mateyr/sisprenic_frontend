import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients, updateClient } from "../services/client-api";
import type { ClientFormData } from "../types/client-types";

export function useClients() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.clients.all(),
    queryFn: getClients,
  });

  return {
    clients: data ?? [],
    isLoading,
    error: error?.message,
    refetch,
  };
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClientFormData> }) =>
      updateClient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(id) });
    },
  });
}
