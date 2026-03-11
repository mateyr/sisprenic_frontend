export function formatCurrency(amount: number): string {
    return amount.toLocaleString("es-NI", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("es-NI", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatPercent(rate: number): string {
    return `${(rate * 100).toFixed(2)}%`;
}
