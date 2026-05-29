import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formats";
import { getFullName } from "@/modules/clients/types/client-types";
import type { Loan } from "../types/loan-types";
import { getLoanContract } from "../services/loan-api";
import { IconDownload, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";

interface LoanContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan;
}

export function LoanContractDialog({
  open,
  onOpenChange,
  loan,
}: LoanContractDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const rate = loan.interestRate;
  const totalInterest = loan.principal * rate * loan.termMonths;
  const totalAmount = loan.principal + totalInterest;
  const monthlyPayment = loan.principal * rate;

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const blob = await getLoanContract(loan.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `contrato-prestamo-${loan.id}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast.success("Contrato descargado correctamente.");
    } catch {
      toast.error("No se pudo descargar el contrato. Inténtalo más tarde.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Contrato de Préstamo #{loan.id}</DialogTitle>
          <DialogDescription>
            Vista previa del contrato. Usa el botón para descargar el PDF
            oficial.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <ContractPreview
            loan={loan}
            totalInterest={totalInterest}
            totalAmount={totalAmount}
            monthlyPayment={monthlyPayment}
          />
        </div>

        <DialogFooter className="shrink-0 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                Descargando...
              </>
            ) : (
              <>
                <IconDownload className="size-4" />
                Descargar PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ContractPreviewProps {
  loan: Loan;
  totalInterest: number;
  totalAmount: number;
  monthlyPayment: number;
}

function ContractPreview({
  loan,
  totalInterest,
  totalAmount,
  monthlyPayment,
}: ContractPreviewProps) {
  const clientName = loan.client ? getFullName(loan.client) : "—";
  const clientId = loan.client?.identification ?? "—";
  const clientPhone = loan.client?.phoneNumber ?? "—";

  return (
    <div className="rounded-md border bg-white p-8 text-sm text-gray-800 shadow-sm dark:bg-gray-950 dark:text-gray-200">
      {/* Encabezado */}
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sistema de Préstamos
        </p>
        <h2 className="mt-1 text-xl font-bold uppercase tracking-wide">
          SISPRENIC
        </h2>
        <Separator className="mt-4" />
        <h3 className="mt-4 text-base font-semibold uppercase tracking-wider">
          Contrato de Préstamo
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Ref. No. PREST-{String(loan.id).padStart(5, "0")} &nbsp;|&nbsp; Fecha
          de emisión: {formatDate(loan.startDate)}
        </p>
      </div>

      {/* Partes */}
      <Section title="I. DE LAS PARTES">
        <ContractRow label="Prestamista" value="SISPRENIC" />
        <ContractRow label="Prestatario" value={clientName} />
        <ContractRow label="Identificación" value={clientId} />
        <ContractRow label="Teléfono" value={clientPhone} />
      </Section>

      {/* Términos */}
      <Section title="II. TÉRMINOS DEL PRÉSTAMO">
        <ContractRow
          label="Monto Principal"
          value={formatCurrency(loan.principal)}
          highlight
        />
        <ContractRow
          label="Tasa de Interés Mensual"
          value={formatPercent(loan.interestRate)}
        />
        <ContractRow label="Plazo" value={`${loan.termMonths} meses`} />
        <ContractRow
          label="Fecha de Inicio"
          value={formatDate(loan.startDate)}
        />
      </Section>

      {/* Resumen financiero */}
      <Section title="III. RESUMEN FINANCIERO">
        <ContractRow
          label="Interés Total Estimado"
          value={formatCurrency(totalInterest)}
        />
        <ContractRow
          label="Monto Total a Pagar"
          value={formatCurrency(totalAmount)}
          highlight
        />
        <ContractRow
          label="Cuota Mensual (Interés)"
          value={formatCurrency(monthlyPayment)}
        />
      </Section>

      {/* Cláusulas */}
      <Section title="IV. CONDICIONES GENERALES">
        <p className="text-xs leading-relaxed text-muted-foreground">
          El prestatario se compromete a realizar los pagos mensuales
          correspondientes al interés generado durante cada periodo, así como
          los abonos a capital acordados. El incumplimiento de pago en la fecha
          pactada podrá generar cargos adicionales conforme a las políticas
          vigentes de SISPRENIC. El presente contrato es de carácter privado y
          tiene plena validez legal una vez firmado por ambas partes.
        </p>
      </Section>

      {/* Firmas */}
      <Section title="V. FIRMAS">
        <div className="mt-6 grid grid-cols-2 gap-8">
          <SignatureBlock label="Prestamista" name="SISPRENIC" />
          <SignatureBlock label="Prestatario" name={clientName} id={clientId} />
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function ContractRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border/50 pb-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={
          highlight ? "font-semibold text-foreground" : "text-xs font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}

function SignatureBlock({
  label,
  name,
  id,
}: {
  label: string;
  name: string;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-10 border-b border-gray-400" />
      <p className="text-[11px] font-medium">{name}</p>
      {id && (
        <p className="text-[10px] text-muted-foreground">ID: {id}</p>
      )}
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
