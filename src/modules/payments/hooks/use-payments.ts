import { useCallback, useEffect, useState } from "react";
import { getPayments } from "../services/payment-api";
import type { Payment } from "../types/payment-types";

export function usePayments(loanId?: number) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const all = await getPayments();
      const filtered =
        loanId !== undefined ? all.filter((p) => p.loanId === loanId) : all;
      setPayments(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, isLoading, error, refresh: fetchPayments };
}
