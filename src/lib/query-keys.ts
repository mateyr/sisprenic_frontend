export const queryKeys = {
  loans: {
    all: () => ["loans"] as const,
    detail: (id: number) => ["loans", id] as const,
    payments: (loanId: number) => ["loans", loanId, "payments"] as const,
    contract: (loanId: number) => ["loans", loanId, "contract"] as const,
  },
  payments: {
    all: () => ["payments"] as const,
  },
  clients: {
    all: () => ["clients"] as const,
    detail: (id: number) => ["clients", id] as const,
  },
} as const;
