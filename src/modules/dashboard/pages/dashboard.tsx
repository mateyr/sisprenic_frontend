import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formats";
import {
  IconCash,
  IconCoinFilled,
  IconFileDescription,
  IconPlus,
  IconUserPlus,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const MOCK_SUMMARY = {
  totalLent: 385000,
  currentDebt: 247500,
  activeLoans: 12,
  activeClients: 8,
};

const MOCK_RECENT_LOANS = [
  { id: 1, client: "Rodian Matey", principal: 10000, interestRate: 0.1, termMonths: 6, startDate: "2026-03-11" },
  { id: 2, client: "María López", principal: 20000, interestRate: 0.12, termMonths: 12, startDate: "2026-03-10" },
  { id: 3, client: "Carlos Pérez", principal: 15000, interestRate: 0.08, termMonths: 8, startDate: "2026-03-08" },
  { id: 4, client: "Ana García", principal: 5000, interestRate: 0.15, termMonths: 3, startDate: "2026-03-05" },
  { id: 5, client: "Luis Hernández", principal: 30000, interestRate: 0.1, termMonths: 18, startDate: "2026-03-01" },
];

const MOCK_RECENT_PAYMENTS = [
  { id: 1, client: "Rodian Matey", amount: 1833.33, date: "2026-03-12" },
  { id: 2, client: "Carlos Pérez", amount: 2031.25, date: "2026-03-11" },
  { id: 3, client: "María López", amount: 1866.67, date: "2026-03-10" },
  { id: 4, client: "Ana García", amount: 1916.67, date: "2026-03-09" },
  { id: 5, client: "Luis Hernández", amount: 1833.33, date: "2026-03-07" },
];

const SUMMARY_CARDS = [
  { label: "Total Prestado", value: formatCurrency(MOCK_SUMMARY.totalLent), icon: IconCoinFilled },
  { label: "Deuda Actual", value: formatCurrency(MOCK_SUMMARY.currentDebt), icon: IconWallet },
  { label: "Préstamos Activos", value: String(MOCK_SUMMARY.activeLoans), icon: IconFileDescription },
  { label: "Clientes Activos", value: String(MOCK_SUMMARY.activeClients), icon: IconUsers },
] as const;

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/clients">
            <IconUserPlus className="size-5" />
            Nuevo Cliente
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/loans/new">
            <IconPlus className="size-5" />
            Nuevo Préstamo
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/loans">
            <IconCash className="size-5" />
            Registrar Pago
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {card.label}
                </CardTitle>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <card.icon className="text-primary size-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Préstamos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Tasa</TableHead>
                    <TableHead className="text-right">Plazo</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RECENT_LOANS.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">
                        {loan.client}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(loan.principal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercent(loan.interestRate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {loan.termMonths} meses
                      </TableCell>
                      <TableCell>{formatDate(loan.startDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Monto del Pago</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RECENT_PAYMENTS.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.client}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
