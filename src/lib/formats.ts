export function formatCurrency(amount: number): string {
    return amount.toLocaleString("es-NI", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("es-NI", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatPercent(rate: number): string {
    return `${(rate * 100).toFixed(2)}%`;
}
