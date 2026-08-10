import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getClient } from "../services/client-api";

export function useClientDetail(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => getClient(id),
  });

  return {
    client: data ?? null,
    isLoading,
    error:
      error instanceof Error
        ? error.message
        : error
          ? "Error desconocido"
          : null,
  };
}
