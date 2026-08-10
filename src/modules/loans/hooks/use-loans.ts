import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLoan, getLoans } from "../services/loan-api";
import type { LoanFormData } from "../types/loan-types";

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

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanFormData) => createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all() });
    },
  });
}
