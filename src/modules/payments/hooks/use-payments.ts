import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  deletePayment,
  getLoanPayments,
  getPayments,
} from "../services/payment-api";
import type { PaymentFormData } from "../types/payment-types";

export function usePayments(loanId?: number) {
  const { data, isLoading, error } = useQuery({
    queryKey:
      loanId !== undefined
        ? queryKeys.loans.payments(loanId)
        : queryKeys.payments.all(),
    queryFn: () =>
      loanId !== undefined ? getLoanPayments(loanId) : getPayments(),
  });

  return {
    payments: data ?? [],
    isLoading,
    error:
      error instanceof Error
        ? error.message
        : error
          ? "Error desconocido"
          : null,
  };
}

export function useCreatePayment(loanId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentFormData) => createPayment({ ...data, loanId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.loans.detail(loanId),
      });
    },
  });
}

export function useDeletePayment(loanId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) => deletePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.loans.payments(loanId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.loans.detail(loanId),
      });
    },
  });
}
