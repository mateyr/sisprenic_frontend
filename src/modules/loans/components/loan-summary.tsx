import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formats";

interface LoanSummaryProps {
  principal: number;
  interestRate: number;
  termMonths: number;
}

export function LoanSummary({
  principal,
  interestRate,
  termMonths,
}: LoanSummaryProps) {
  const rate = interestRate / 100;
  const totalInterest = principal * rate * termMonths;
  const totalAmount = principal + totalInterest;
  const monthlyPayment = principal * rate;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Préstamo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <SummaryRow label="Monto Principal" value={formatCurrency(principal)} />
          <Separator />
          <SummaryRow
            label="Interés Total"
            value={formatCurrency(totalInterest)}
          />
          <Separator />
          <SummaryRow
            label="Monto Total"
            value={formatCurrency(totalAmount)}
          />
          <Separator />
          <SummaryRow
            label="Cuota Mensual"
            value={formatCurrency(monthlyPayment)}
            highlight
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={highlight ? "text-lg font-semibold" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}
