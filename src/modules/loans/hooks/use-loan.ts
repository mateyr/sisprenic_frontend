import { useCallback, useEffect, useState } from "react";
import { getClient } from "@/modules/clients/services/client-api";
import type { Client } from "@/modules/clients/types/client-types";
import { getLoan } from "../services/loan-api";
import type { Loan } from "../types/loan-types";

export function useLoan(id: number) {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loanData = await getLoan(id);
      setLoan(loanData);

      if (loanData.client) {
        setClient(loanData.client);
      } else {
        const clientData = await getClient(loanData.clientId);
        setClient(clientData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loan, client, isLoading, error };
}
