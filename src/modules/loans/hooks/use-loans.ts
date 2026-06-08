import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getLoans } from "../services/loan-api";

export function useLoans() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.loans.all(),
    queryFn: getLoans,
  });

  return {
    loans: data ?? [],
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
}
