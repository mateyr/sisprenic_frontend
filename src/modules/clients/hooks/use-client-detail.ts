import { useCallback, useEffect, useState } from "react";
import { getClientDetail } from "../services/client-api";
import type { ClientDetail } from "../types/client-types";

export function useClientDetail(id: number) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClientDetail(id);
      setClient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { client, isLoading, error };
}
