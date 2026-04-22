import { useCallback, useEffect, useState } from "react";
import { getPayments, getLoanPayments } from "../services/payment-api";
import type { Payment } from "../types/payment-types";

export function usePayments(loanId?: number) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = 
        loanId !== undefined ? await getLoanPayments(loanId) : await getPayments();
      setPayments(data);
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
