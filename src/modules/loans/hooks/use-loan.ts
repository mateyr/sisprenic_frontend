import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getLoan } from "../services/loan-api";

export function useLoan(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.loans.detail(id),
    queryFn: () => getLoan(id),
  });

  return {
    loan: data ?? null,
    client: data?.client ?? null,
    isLoading,
    error: error instanceof Error ? error.message : error ? "Error desconocido" : null,
  };
}
